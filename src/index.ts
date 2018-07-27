import {
    Plugin,
    PluginUnit,
    ComponentUnit,
    ComponentInstance,
    ComponentConfig,
    PluginConfig,
    ComponentConfigInstance,
    PluginInstance,
} from '@leverage/core';

import * as http from 'http';
import * as socketio from 'socket.io';

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

export class WebSocket extends Plugin implements PluginUnit {
    type = 'websocket';
    config: PluginConfig = {
        dependencies: {
            plugins: [
                'http',
            ],
        },
    };

    io: socketio.Server;
    attached = false;
    namespaces: {
        [name: string]: socketio.Namespace;
    } = {};

    constructor (options?: socketio.ServerOptions) {
        super();

        this.io = socketio(options);
    }

    websocket (component: WebSocketComponentInstance) {
        if (!('websocket' in component.config)) {
            component.config.websocket = {};
        }

        if (!('namespace' in component.config.websocket!)) {
            component.config.websocket!.namespace = '/';
        }

        if (!('event' in component.config.websocket!)) {
            component.config.websocket!.event = 'connection';
        }

        /*
         * Attach to http server
         */
        if (!this.attached) {
            // @ts-ignore
            const instance: PluginInstance = this;

            if (!('middleware' in instance.plugins.http)) {
                throw new Error(
                    '[WebSocket] The HTTP Plugin does not support middleware',
                );
            }

            instance.plugins.http.middleware!({
                is: 'middleware',
                type: 'http',
                config: {
                    dependencies: {
                        plugins: [],
                        services: [],
                    },
                },
                http: (options: { server: http.Server }) => {
                    this.io.attach(options.server);

                    this.attached = true;
                },
                plugins: {},
                services: {},
            });
        }

        /*
         * Create namespace if it doesn't exist
         */
        if (!(component.config.websocket!.namespace! in this.namespaces)) {
            this.namespaces[
                component.config.websocket!.namespace!
            ] = this.io.of(component.config.websocket!.namespace!);
        }

        this.namespaces[
            component.config.websocket!.namespace!
        ].on('connection', socket => {
            if (component.config.websocket!.event! === 'connection') {
                component.websocket({
                    socket,
                    io: this.io,
                    namespace: this.namespaces[
                        component.config.websocket!.namespace!
                    ],
                });
            } else {
                socket.on(component.config.websocket!.event!, (data: any) => {
                    component.websocket({
                        data,
                        socket,
                        io: this.io,
                        namespace: this.namespaces[
                            component.config.websocket!.namespace!
                        ],
                    });
                });
            }
        });
    }
}

export default WebSocket;
