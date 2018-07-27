const namespace = {
    on: jest.fn(),
};

const instance = {
    of: () => namespace,
};

function io (){
    return instance;
}

(io as any).instance = instance;
(io as any).namespace = namespace;

export = io;
