import * as L from './index'

const expectedDockerFile = `FROM nginx:mainline-alpine

COPY nginx.conf /etc/nginx/conf.d

EXPOSE 3000`

const config = `
  server {
    listen 3000;

    client_max_body_size 10M;

    add_header Cache-Control \"no-store, no-cache, must-revalidate\";

    error_page 404 =200 /index.html;
}`

test('generate dockerfile', () => {
    const dockerFile = L.getDockerfile(3000)
    expect(dockerFile).toEqual(expectedDockerFile);
});

test('getConfig', () => {
    const configGenerated= L.getConfig([], 3000)
    expect(config).toEqual(configGenerated)
})