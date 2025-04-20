/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const { userName, request } = event;
  const email = request.userAttributes.email;

  const params = {
    TableName: "Users-<your-env>", // replace <your-env> with actual env (like Users-dev)
    Item: {
      userId: userName,
      email: email,
      createdAt: new Date().toISOString()
    }
  };

  try {
    await docClient.put(params).promise();
    console.log("User saved to DynamoDB");
  } catch (err) {
    console.error("Error saving user:", err);
  }

  return event;
};
