import * as L from './index'

const expectedDockerFile = `FROM nginx:mainline-alpine

COPY nginx.conf /etc/nginx/conf.d

EXPOSE 3000`

const configTop = `
  server {
    listen 3000;

    client_max_body_size 10M;

    add_header Cache-Control \"no-store, no-cache, must-revalidate\";`

const configTop2 = `
  server {
    listen 3000;

    server_name app.myapp.com;

    client_max_body_size 10M;

    add_header Cache-Control \"no-store, no-cache, must-revalidate\";`

const configBottom = `    error_page 404 =200 /index.html;
}`

const config = configTop + '\n\n' + configBottom;

test('generate dockerfile', () => {
    const dockerFile = L.getDockerfile(3000)
    expect(dockerFile).toEqual(expectedDockerFile);
});

test('getConfig', () => {
    const configGenerated= L.getConfig([],{port: 3000})
    expect(config).toEqual(configGenerated)
})

test('getConfig', () => {
    const configGenerated= L.getNginxConfigTop({port: 3000})
    expect(configTop).toEqual(configGenerated)
})

test('getConfig2', () => {
    const configGenerated= L.getNginxConfigTop({port: 3000, server: 'app.myapp.com'})
    expect(configTop2).toEqual(configGenerated)
})