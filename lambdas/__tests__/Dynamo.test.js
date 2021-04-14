const Dynamo = require("../common/Dynamo");

test("Dynamo is an object", () => {
	expect(typeof Dynamo).toBe("object");
});

const tableName = "files";
const data = {
	id: "1",
	hello: "world",
};

test("Dynamo write works", async () => {
	expect.assertions(1);
	try {
		const res = await Dynamo.write(data, tableName);
		expect(res).toBe(data);
	} catch (error) {
		console.log("error in dynamo write test", error);
	}
});

test("Dynamo get works", async () => {
	expect.assertions(1);
	try {
		const res = await Dynamo.get({ id: data.id }, tableName);
		expect(res).toStrictEqual(data);
	} catch (error) {
		console.log("error in dynamo write test", error);
	}
});

test("Dynamo query works", async () => {
	expect.assertions(1);
	const params = {
		ExpressionAttributeValues: {
			":id": data.id,
		},
		KeyConditionExpression: "id = :id",
		TableName: tableName,
	};
	try {
		const res = await Dynamo.query(params);
		expect(res[0]).toStrictEqual(data);
	} catch (error) {
		console.log("error in dynamo query test", error);
	}
});

const updatedData = {
	id: "1",
	hello: "world",
	update: "yes",
};
test("Dynamo update works", async () => {
	expect.assertions(1);
	try {
		const res = await Dynamo.update(tableName, updatedData, "id", null);
		delete updatedData.id;
		expect(res).toStrictEqual(updatedData);
	} catch (error) {
		console.log("error in dynamo query test", error);
	}
});

test("Dynamo delete works", async () => {
	expect.assertions(1);
	await Dynamo.delete({ id: data.id }, tableName);
	await expect(Dynamo.get({ id: data.id }, tableName)).rejects.toThrow(
		`There was an error fetching data for key: ${JSON.stringify(
			{ id: data.id },
			null,
			2
		)} from ${tableName}`
	);
});
