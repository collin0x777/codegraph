# Python WebSocket Server

import asyncio
import websockets
import json
import docker

# Initialize Docker client
docker_client = docker.from_env()

# Store information and results of containers
containers_info = {}  # Use container ID as the key

async def handle_client(websocket, path):
    try:
        # Create a new Docker container on each request
        container = docker_client.containers.run("your-image-name", detach=True)

        # Store container information
        container_info = {
            "container_id": container.id,
            "status": "Running",
            "results": []  # Store container results here
        }

        container.logs()

        # Add the container info to the dictionary
        containers_info[container.id] = container_info

        while True:
            # Wait for a JSON message from the client
            client_request = await websocket.recv()
            client_request_json = json.loads(client_request)

            # Process the client request (you can implement your logic here)
            # ...

            # Store results in the container_info['results'] list
            container_info['results'].append({"message": "Your result message"})

            # Send a JSON response back to the client
            await websocket.send(json.dumps(container_info))

    except websockets.exceptions.ConnectionClosed:
        pass  # Connection closed by the client

    finally:
        # Remove the container info from the dictionary when the connection is closed
        del containers_info[container.id]

        # Stop and remove the container
        container.stop()
        container.remove()


async def main():
    server = await websockets.serve(handle_client, "localhost", 8765)
    await server.wait_closed()


if __name__ == "__main__":
    asyncio.run(main())
