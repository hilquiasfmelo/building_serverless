import { APIGatewayProxyHandler } from "aws-lambda";

import { document } from "../utils/dynamodbClient";

export const handle: APIGatewayProxyHandler = async (event) => {
  const { user_id } = event.pathParameters;

  const response = await document
    .query({
      TableName: "building_serverless",
      KeyConditionExpression: "user_id = :user_id",
      ExpressionAttributeValues: {
        ":user_id": user_id,
      },
    })
    .promise();

  const todos = response.Items;

  if (!todos) {
    return {
      statusCode: 204,
      body: JSON.stringify({
        error: "No Content",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Success",
      todo: todos,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  };
};
