import express from "express";

export class Application {
  private port = process.env.PORT;

  constructor(private app = express()) {}

  private start(): void {
    this.setupRoutes();
    this.setupServer();
  }

  private setupRoutes(): void {}

  private setupServer(): void {
    this.app.listen(this.port, () => {
      console.log("Server listening on port:" + this.port);
    });
  }
}
