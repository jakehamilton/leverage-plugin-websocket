import { WebSocket, WebSocketComponent, WebSocketComponentInstance } from '..';
import { ComponentUnit } from '@leverage/core';

jest.mock('http');
jest.mock('socket.io');

describe('WebSocket', () => {
    test('can create an instance', () => {
        expect(() => {
            const websocket = new WebSocket();
        }).not.toThrow();
    });

    test('can install a component', () => {
        const component: WebSocketComponentInstance = {
            is: 'component',
            type: [
                'websocket',
            ],
            config: {
                dependencies: {
                    plugins: [],
                    services: [],
                },
            },
            // tslint:disable-next-line:no-empty
            websocket () {},
            plugins: {},
            services: {},
        };

        const websocket = new WebSocket();
        (websocket as any).plugins = {
            http: {
                middleware: jest.fn(),
            },
        };

        expect(() => {
            websocket.websocket(component);
        }).not.toThrow();
    });

    test('attaches to a http server', () => {
        const component: WebSocketComponentInstance = {
            is: 'component',
            type: [
                'websocket',
            ],
            config: {
                dependencies: {
                    plugins: [],
                    services: [],
                },
            },
            // tslint:disable-next-line:no-empty
            websocket () {},
            plugins: {},
            services: {},
        };

        const websocket = new WebSocket();
        (websocket as any).plugins = {
            http: {
                middleware: jest.fn(),
            },
        };

        expect(() => {
            websocket.websocket(component);
        }).not.toThrow();

        expect(
            (websocket as any).plugins.http.middleware.mock.calls[0][0],
        ).toBeTruthy();
    });
});
