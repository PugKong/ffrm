#!/usr/bin/env node

import { Command } from "commander";
import { BrowserContext, firefox } from "playwright-core";
import express from "express";
import morgan from "morgan";
import { URL } from "url";

const program = new Command();

program.name("ffrm").description("Fetch web articles using Firefox in reader mode").version("0.0.2");
program.command("fetch <url>").description("Fetches article's content from the specified URL").action(cli);
program
  .command("serve")
  .description("Starts an HTTP server")
  .option("-p, --port <port>", "Port number to run", (n: string) => parseInt(n), 8000)
  .option("-h, --host <host>", "Host address to run", "localhost")
  .action(server);

program.parse(process.argv);

async function cli(url: string) {
  const browser = await firefox.launch();
  const context = await browser.newContext();

  try {
    const result = await fetchContent(context, url);

    console.log(result.title);
    console.log();
    console.log(result.content);
  } finally {
    await context.close();
    await browser.close();
  }
}

async function server(options: { host: string; port: number }) {
  const app = express();
  app.use(express.json());
  app.use(morgan("short"));

  const browser = await firefox.launch();
  app.post("/fetch", async (req, res) => {
    const { url } = req.body;

    try {
      const u = new URL(url);
      if (u.protocol !== "http:" && u.protocol !== "https:") {
        throw new Error("unsupported protocol");
      }
    } catch (e) {
      res.status(422).json({ status: "error", message: "invalid url" });

      return;
    }

    const context = await browser.newContext();
    try {
      const result = await fetchContent(context, url);

      res.json({ status: "ok", ...result });
    } catch (e) {
      console.error(e);

      let message = "unknown error";
      if (e instanceof Error) {
        message = e.message;
      }

      res.status(500).json({ status: "error", message: message });
    } finally {
      await context.close();
    }
  });

  app.listen(options.port, options.host, () => console.log(`Listening ${options.host}:${options.port}`));
}

async function fetchContent(context: BrowserContext, url: string): Promise<{ title: string; content: string }> {
  const page = await context.newPage();
  try {
    const titleLocator = page.locator("h1.reader-title");
    const contentLocator = page.locator("div.content");
    const errorLocator = page.locator("div[data-l10n-id='about-reader-load-error']");

    await page.goto(`about:reader?url=${url}`);
    await Promise.any([contentLocator.waitFor({ state: "visible" }), errorLocator.waitFor({ state: "visible" })]);

    const title = await titleLocator.innerText();
    const content = await contentLocator.innerText();
    if (content == "") {
      throw new Error(await errorLocator.innerText());
    }

    return {
      title: title,
      content: content,
    };
  } finally {
    await page.close();
  }
}
