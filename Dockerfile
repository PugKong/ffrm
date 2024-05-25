FROM mcr.microsoft.com/playwright:v1.44.1

RUN npm install -g ffrm@0.0.1

USER pwuser

ENTRYPOINT [ "ffrm" ]
CMD [ "serve", "-h", "0.0.0.0" ]
