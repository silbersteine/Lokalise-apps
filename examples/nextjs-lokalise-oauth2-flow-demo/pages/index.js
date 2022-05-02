import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { LokaliseAuth, LokaliseApiOAuth } from '@lokalise/node-api'
import { useRouter } from 'next/router'
import cookie from "cookie"

const {
  LOKALISE_APP_CLIENT_ID,
  LOKALISE_APP_CLIENT_SECRET,
  LOKALISE_APP_CALLBACK_URL
} = process.env;

// This gets called on every request
export async function getServerSideProps({ query, req }) {
  const lokaliseAuth = new LokaliseAuth(LOKALISE_APP_CLIENT_ID, LOKALISE_APP_CLIENT_SECRET);
  const url = lokaliseAuth.auth(["read_projects"], LOKALISE_APP_CALLBACK_URL, "random123");
  const apiToken = req.cookies['lokalise-api-token'];
  let projects = null;
  
  if (apiToken) {
    // const { access_token } = await lokaliseAuth.token(apiToken);
    // console.log('access_token', access_token);
    // const lokaliseApi = new LokaliseApiOAuth({ apiKey:  access_token });
    // projects = await lokaliseApi.projects().list();

    const lokaliseApi = new LokaliseApiOAuth({ apiKey: apiToken });
    projects = await lokaliseApi.projects().list();
    await console.log(projects, JSON.stringify(projects.items));
  }

  // Pass data to the page via props
  return { 
    props: { 
      url, 
      isAppAuthorized: !!apiToken || false, 
      isUrlQueryAuthorized: !!query.authorized || false,
      projects: JSON.parse(JSON.stringify(projects.items)) || []
    } 
  }
}

export default function Home({ url, isAppAuthorized, isUrlQueryAuthorized, projects }) {
  const router = useRouter();
  if (isUrlQueryAuthorized && (typeof window !== "undefined")) {
    router.push('/', null, { shallow: false })
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Nextjs Lokalise Oauth2 flow demo</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={styles.pageHeader}>
        <nav>
          <ul className={styles.navList}>
            <li>
              {!isAppAuthorized && <a href={url}>
                Connect your Lokalise account
              </a>}
            </li>
            <li>
              {isAppAuthorized && !isUrlQueryAuthorized && <a href='' onClick={async (event) => {
                event.preventDefault();
                await fetch("/api/logout", {
                  method: "post",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({}),
                });
                router.reload(window.location.pathname)
              }}> Sign out </a>}
            </li>
          </ul>
        </nav>
      </header>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Nextjs <a href="https://lokalise.com">Lokalise</a> Oauth2 flow demo
        </h1>
        <hr />
        <div>
          <h3> Your recent Lokalise projects</h3>
          <ul>
            {projects.map(({name, project_id}) => (<li key={project_id}>{name}</li>))}
          </ul>
        </div>
        

      </main>

      <footer className={styles.footer}>
        <a
          href="https://lokalise.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '} Loklaise
        </a>
      </footer>
    </div>
  )
}