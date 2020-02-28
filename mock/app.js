export default {
  'GET /api/apps': [
    {
      name: '设备',
      entry: 'http://localhost:8001/godevice',
      base: '/godevice',
      mountElementId: 'root-subapp-container',
    },
    // {
    //   name: 'app2',
    //   entry: 'http://localhost:8002/app2',
    //   base: '/app2',
    //   mountElementId: 'root-subapp-container',
    //   props: {
    //     testProp: 'test',
    //   },
    // },
    // {
    //   name: 'app3',
    //   entry: 'http://localhost:8003/app3',
    //   base: '/app3/:abc',
    //   mountElementId: 'root-subapp-container',
    // },
  ],
};
