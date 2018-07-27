# WebSockets for [Leverage](https://github.com/jakehamilton/leverage)!

This is a plugin for Leverage that handles the `websocket` type of components.

<p align="center">
    <img src="https://img.shields.io/badge/leverage-plugin-blue.svg?style=for-the-badge">
    <img src="https://img.shields.io/npm/v/@leverage/plugin-websocket.svg?style=for-the-badge">
    <img src="https://img.shields.io/travis/jakehamilton/leverage-plugin-websocket.svg?style=for-the-badge">
    <img src="https://img.shields.io/coveralls/github/jakehamilton/leverage-plugin-websocket.svg?style=for-the-badge">
    <img src="https://img.shields.io/badge/semantic_release_🚀📦-enabled-brightgreen.svg?style=for-the-badge">
</p>

## WebSocket Component

A WebSocket component has the following interface:

```typescript
import {
    ComponentUnit,
    ComponentInstance,
    ComponentConfig,
    ComponentConfigInstance,
} from '@leverage/core';

type WebSocketCallback = (
    options: {
        io: socketio.Server;
        socket: socketio.Socket;
        namespace: socketio.Namespace;
        data?: any;
    },
) => void;

interface WebSocketConfig {
    websocket?: {
        namespace?: string;
        event?: string;
    };
}

export interface WebSocketComponent extends ComponentUnit {
    config?: ComponentConfig & WebSocketConfig;
    websocket: WebSocketCallback;
}

export interface WebSocketComponentInstance extends ComponentInstance {
    config: ComponentConfigInstance & WebSocketConfig;
    websocket: WebSocketCallback;
}
```

## WebSocket Plugin

The plugin can be instantiated with options for configuring [socket.io](https://socket.io/docs/server-api).

```typescript
import WebSocket from '@leverage/plugin-websocket';

// without options
new WebSocket();

// with options
new WebSocket({
    path: '/my/custom/path',
    serveClient: true,
})
```

## Example

```typescript
import { Manager } from '@leverage/core';
import { WebSocket, WebSocketComponent } from '@leverage/plugin-websocket';

// You need an HTTP plugin to use WebSockets
import { HTTP } from '@leverage/plugin-http';

const http = new HTTP();
const websocket = new WebSocket();

const manager = new Manager();

const component: WebSocketComponent = {
    is: 'component',
    type: 'websocket',
    websocket ({ namespace }) {
        namespace.emit('message', {
            text: 'Hello, World!',
        });
    }
}

manager.add(http, websocket, component);

http.listen(3000);
```
