# ffrm

`ffrm` is a CLI tool and API server for fetching web articles using Firefox in reader mode.
It is distributed as an npm package and a Docker image.

## Features

- Fetch article content from a specified URL using Firefox in reader mode
- Run as a command-line interface (CLI) tool
- Start an HTTP server to handle fetch requests via API

## Installation

### Using npm

To install `ffrm` as an npm package, run:

```bash
npm install -g ffrm
```

### Using Docker

To use the Docker image, pull it from GitHub Container Registry:

```bash
docker pull ghcr.io/pugkong/ffrm
```

## Usage

### CLI Mode

Fetch the content of an article from a URL:

```bash
ffrm fetch <url>
```

Example:

```bash
ffrm fetch https://example.com/article
```

### API Server Mode

Start the API server:

```bash
ffrm serve
```

You can specify the host and port:

```bash
ffrm serve --host 0.0.0.0 --port 8080
```

### Using Docker in CLI Mode

Run the Docker container in CLI mode:

```bash
docker run --rm ghcr.io/pugkong/ffrm fetch <url>
```

### Using Docker in API Server Mode

Run the Docker container in server mode:

```bash
docker run --rm -p 8000:8000 ghcr.io/pugkong/ffrm
```

## API

### Endpoint

`POST /fetch`

### Request

```json
{
  "url": "https://example.com/article"
}
```

### Response

```json
{
  "status": "ok",
  "title": "Article Title",
  "content": "Article content in reader mode..."
}
```

## License

This project is licensed under the [UNLICENSE](https://unlicense.org/).

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Acknowledgments

- Uses [Playwright](https://playwright.dev/) for browser automation.
- Uses [Express](https://expressjs.com/) for the API server.
- Logging provided by [Morgan](https://github.com/expressjs/morgan).
