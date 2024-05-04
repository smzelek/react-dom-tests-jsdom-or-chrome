# React DOM Tests in a Real Browser

This repo uses Karma to launch **real instances of Chrome instead of using Jest+JSDOM**!

This setup allows you to run in Headful or Headless Chrome and visually debug your DOM tests, which is simply not possible in the default CRA+Jest+JSDOM setup.  

With this setup, you can still use React Testing Library as you may be used to - it just works! 💥

## Cross-test runner compatibility
This repo contains compatibility mapping code that allows you to run the RTL Component Tests in _either_ Jest+JSDOM or Karma+Chrome.  

It also contains wrapper code that allows you to add MSW for API mocking, which works with either test runner due to the compatibility code.

### Run with JSDOM in Jest
```bash
npm run test:jsdom
# react-scripts test --watchAll=false
```

### Run with Chrome in Karma
```bash
npm run test:realdom
# karma start --single-run
```
