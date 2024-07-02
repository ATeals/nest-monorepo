import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={`Hello from ${siteConfig.title}`} description="Description will go into a meta tag in <head />">
      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '5rem',
        }}
      >
        <img
          src="https://avatars.githubusercontent.com/u/125727432?v=4"
          alt="logo"
          width={200}
          height={200}
          style={{ borderRadius: '50%' }}
        />
        <h1 style={{ margin: '5rem 0' }}>Nest-Monorepo</h1>
        <p>Nest를 학습하며 만드는 Module Repo</p>
      </main>
    </Layout>
  );
}
