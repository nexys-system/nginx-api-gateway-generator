interface ProxyPass {url: string, location: string}

interface ConfigOptions {port:number, server?:string}

export const getNginxConfigTop = ({port, server}:ConfigOptions) => {
    const lines = [
      `listen ${port};`,
      server ? `server ${server};` : null,
      'client_max_body_size 10M;',
      'add_header Cache-Control "no-store, no-cache, must-revalidate";'
    ]

    const body = lines.filter(x => x!== null).map(x => ' '.repeat(4) + x).join('\n\n');

    return ['\n  server {', body].join('\n');
}

export const getConfig = (
    proxyPasses:ProxyPass[],
    {port = 3000, server}:Partial<ConfigOptions> = {}
):string => {
    const proxyPassesConfig = proxyPasses
    .map(({ url, location }) => {
        return `
    location = ${location} {
        return 301 $scheme://$http_host$uri/;
    }

    location ${location + "/"} {
        proxy_http_version 1.1;
        proxy_pass ${url}/;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header X-Real-IP $remote_addr;
    }
    `;
    })
    .join("\n");

    const ngxinConfigTop = getNginxConfigTop({port, server});

    const ngxinConfigBottom = `    error_page 404 =200 /index.html;
}`;

    return  [ngxinConfigTop, proxyPassesConfig, ngxinConfigBottom].join(
    "\n"
    );
}

export const getDockerfile = (port: number) => {
    const dockerFileLines = [
        'FROM nginx:mainline-alpine',
        'COPY nginx.conf /etc/nginx/conf.d',
        `EXPOSE ${port}`
    ]

    return dockerFileLines.join('\n\n');
}
