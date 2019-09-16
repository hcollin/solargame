

export default function createMyService(jokiInstance, options={}) {
    const serviceId = options.serviceId || "MyService";

    const  data = new Map();
    function handler(event) {

    }


    jokiInstance.addService({
        id: serviceId,
        fn: handler
    });

}