const Responses = require("../common/API_Responses");

// Based from https://github.com/SamWSoftware/ServerlessYoutubeSeries/tree/l45-debugging
test("Responses is an object", () => {
	expect(typeof Responses).toBe("object");
});

test("_200 works", () => {
	const res = Responses._200({ message: "test" });
	expect(res.statusCode).toBe(200);
	expect(typeof res.body).toBe("string");
	expect(res.headers["Content-Type"]).toBe("application/json");
});

test("_400 works", () => {
	const res = Responses._400({ message: "test" });
	expect(res.statusCode).toBe(400);
	expect(typeof res.body).toBe("string");
	expect(res.headers["Content-Type"]).toBe("application/json");
});
