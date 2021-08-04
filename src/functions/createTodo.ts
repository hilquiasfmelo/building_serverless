import { APIGatewayProxyHandler } from "aws-lambda";

import { document } from "src/utils/dynamodbClient";

interface ICreateTodo {
  id: string;
  title: string;
  done?: boolean;
  deadline: Date;
}
export const handle: APIGatewayProxyHandler = async (event) => {
  const { user_id } = event.pathParameters;
  const { id, title, done = false,  deadline } = JSON.parse(event.body) as ICreateTodo;

  const response = await document
    .query({
      TableName: "building_serverless",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": id,
      },
    })
    .promise();

  const userAlreadyExists = response.Items[0];

  if (!userAlreadyExists) {
    await document
      .put({
        TableName: "building_serverless",
        Item: {
          id,
          user_id,
          title,
          done,
          deadline: new Date(),
        },
      })
      .promise();
  }

  return {
    statusCode: 201,
    body: JSON.stringify({
      id,
      user_id,
      title,
      done,
      deadline,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  };
};
