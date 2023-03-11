// import template from "views/index/template.marko";
import { test } from "vitest";
import supertest from "supertest";
import setupApp from "../lib/init/setupApp.js";

test("Math.sqrt()", () => {
  expect(Math.sqrt(4)).toBe(2);
  expect(Math.sqrt(144)).toBe(12);
  expect(Math.sqrt(2)).toBe(Math.SQRT2);
});

test("supertest", async () => {
  const app = setupApp();
  const response = await supertest(app)
    .get("/")
    .expect(200);
  console.log(response.text)
});
