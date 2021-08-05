import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uuidV4 } from "uuid";
import { document } from "src/utils/dynamodbClient";

interface ICreateToDo {
  title: string;
  deadline: string;
}

interface ITemplate {
  id: string;
  user_id: string;
  title: string;
  done: boolean;
  deadline: string;
}
export const handle: APIGatewayProxyHandler = async (event) => {
  const { user_id } = event.pathParameters;
  const { title, deadline } = JSON.parse(event.body) as ICreateToDo;
  const id = uuidV4();

  const createTodo: ITemplate = {
    id: String(id),
    user_id,
    title,
    done: false,
    deadline: new Date(deadline).toISOString(),
  };

  await document
    .put({
      TableName: "building_serverless",
      Item: createTodo,
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify({
      createTodo,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  };
};
