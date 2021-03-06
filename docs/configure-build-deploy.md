# Configure, build and deploy **Application ID Card**

## Pre requisite

### Pre requisite on the build platform

- Install [node.js](https://nodejs.org/en/download/)
- Install [Vue.js](https://cli.vuejs.org/guide/installation.html)

### Pre requisite to deploy and use Application ID Card

- HOPEX V3 CP4 minimum
- You need to install **HOPEX Graphql** module you can download it from [HOPEX store](https://community.mega.com/t5/HOPEX-Store/GraphQL-REST-API/td-p/21381).
- **HTTPS** protocol is mandatory since **Application ID Card** is a [PWA](https://developers.google.com/web/ilt/pwa/introduction-to-progressive-web-app-architectures).
- [IIS URL Rewrite Extension](https://www.iis.net/downloads/microsoft/url-rewrite), download and install (with MS Web Platform Installer).

---

## Configure Application ID Card

You can configure most of the application parameters before the build of the application.

### Application virtual folder

By default the application is configure to be deploy under : `https://ROOT_API/apP-idcard`

To modify this virtual folder in the  `vue.config.js` file modify the `publicPath`.
Assuming in the rest of the document that audit  everywhere is configure to be deploy on **publicPath**.

```js
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/app-idcard/' : '/my-dev-path/',
  pwa: {
```

See [Configuration Reference](https://cli.vuejs.org/config).

### Configuration file

To configure the application in the `public/config` copy the `config.json.example` to `config.json`

- Set **ROOT_API** to the root url of HOPEX no leading HOPEX no leading **/**. For instance `https://myHopexRootURL.mycompany.com` will be the **ROOT_API** if  `https://myHopexRootURL.mycompany.com/hopex` is the URL of HOPEX.
- The **environmentId** is the absolute identifier of the production environment you can get it form the megasite.ini and convert it.
- The **repositoryId** is the absolute identifier of the repository you can get it form the megaenv.ini and convert it.
- The **profileId** is the absolute identifier of the profile the default value is the absolute identifier of the profile **Auditor**.
- Set the **client_secret** according HOPEX configuration.
- The **connectivity url** can be set to `https://myHopexRootURL.mycompany.com/publicPath/img/px.gif` to avoid cross-site warning, if `https://myHopexRootURL.mycompany.com`
is the ROOT_API.

 ```json
{
  "ROOT_API": "",                     "Comment of ROOT_API":     " root url of HOPEX no leading HOPEX no leading /",
  "environmentId": "",                "Comment of environmentId":" Absolute identifier of the environment see megasite.ini and convert it",
  "repositoryId": "",                 "Comment of repositoryId": " Absolute identifier of the repository  see megaenv.ini and convert it",
  "profileId": "WJH(QMmIILZO",        "Comment of profileId":    " Absolute identifier of the ITPM Reader profile by default WJH(QMmIILZO",
  "client_id": "hopexapi",            "Comment of client_id":    " Authentication Client Id",
  "client_secret": "secret",          "Comment of client_secret":" Authentication Client secret Set the secret of hopexapi check HOPEX configuration",
  "title": "Application ID Card",
  "connectivity": {
    "url": "https://www.google.com/images/phd/px.gif", "Comment of url":         "URL to ping in order to determine the network connectivity",
    "timeToCount": "3",        "Comment of timeToCount": "The number of time we repeat the operation",
    "threshold": "3000",       "Comment of threshold":   "The threshold at which we decide to be offline",
    "interval": "20000",       "Comment of interval":    "The time between each repetition"
  },
  "API_timeout": 6000,         "Comment of API_timeout":  " Limit of time in ms, where the application switches to offline mode 0 will ignore",
  "ASYNC_timeout": 6000,       "Comment of API_timeout":  " Limit of time in ms, where the API waits to give a response or a job ID",
  "synchroInterval" : 6000,    "Comment of synchroInterval":"Time, in ms, between two synchronization with the server HOPEX",
  "toast": {
    "actionTextColor": "black",
    "errorColor": "#EE2665",
    "successColor": "#31B672"
  }
}
 ```

---

## Build Application ID Card

On a command prompt run the following command in the application folder to build the application

```powershell
npm install
npm run build
```

The result of the build will be on the `dist` folder. it is ready to be deploy on your production server.

It will contain the config.json in `dist/public/config`, you can also change some configuration in this file after the build.

---

## Deploy Application ID Card on IIS  

Copy the content of the `dist` folder to `C:\inetpub\wwwroot\publicPath`.

Check the `web.config` to match [URL Rewrite](https://www.iis.net/downloads/microsoft/url-rewrite) Extension for IIS needs.

 ```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
    <rewrite>
      <rules>
        <rule name="Handle History Mode and custom 404/500" stopProcessing="true">
            <match url="(.*)" />
            <conditions logicalGrouping="MatchAll">
              <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
              <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
            </conditions>
          <action type="Rewrite" url="index.html" />
        </rule>
      </rules>
    </rewrite>
      <httpErrors>
          <remove statusCode="404" subStatusCode="-1" />
          <remove statusCode="500" subStatusCode="-1" />
          <error statusCode="404" path="/survey/notfound" responseMode="ExecuteURL" />
          <error statusCode="500" path="/survey/error" responseMode="ExecuteURL" />
      </httpErrors>
      <modules runAllManagedModulesForAllRequests="true"/>
    </system.webServer>
</configuration>
```

You can test `https://myHopexRootURL.mycompany.com/publicPath`.

---

## User guide

[Application ID Card quick start guide](README.md)

---

## Command details

### Project setup

```bash
npm install
```

### Compiles and hot-reloads for development

```bash
npm run serve
```

### Compiles and minifies for production

```bash
npm run build
```

### Run your tests

```bash
npm run test
```

### Lints and fixes files

```bash
npm run lint
```

### Run your unit tests

```bash
npm run test:unit
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
