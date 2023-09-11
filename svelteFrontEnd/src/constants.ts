export const snapId = import.meta.env.DEV?`local:http://localhost:8080/`:'npm:safe-global-snap';
console.log(snapId);