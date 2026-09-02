import { useState, createContext, useContext } from 'react';
import type { Role } from './types';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import MySet from './pages/MySet';
import ADCommand from './pages/ADCommand';
import LiveTake from './pages/LiveTake';
import LightingConsole from './pages/LightingConsole';
import WardrobeTalent from './pages/WardrobeTalent';
import TakeIntelligence from './pages/TakeIntelligence';
import Onboarding from './pages/Onboarding';

export type Page = 'landing' | 'onboarding' | 'myset' | 'adcommand' | 'livetake' | 'lighting' | 'wardrobe' | 'intelligence';

interface AppContextType {
  role: Role;
  setRole: (r: Role) => void;
  page: Page;
  setPage: (p: Page) => void;
  lightingReady: boolean;
  setLightingReady: (v: boolean) => void;
  actorReady: boolean;
  setActorReady: (v: boolean) => void;
  holdState: 'hold' | 'ready' | 'rolling';
  setHoldState: (v: 'hold' | 'ready' | 'rolling') => void;
  resetDemo: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

function App() {
  const [role, setRole] = useState<Role>('1st AD');
  const [page, setPage] = useState<Page>('landing');
  const [lightingReady, setLightingReady] = useState(false);
  const [actorReady, setActorReady] = useState(false);
  const [holdState, setHoldState] = useState<'hold' | 'ready' | 'rolling'>('hold');

  const resetDemo = () => {
    setLightingReady(false);
    setActorReady(false);
    setHoldState('hold');
    setPage('myset');
  };

  const enterApp = () => {
    setPage('onboarding');
  };

  const ctx: AppContextType = {
    role, setRole, page, setPage,
    lightingReady, setLightingReady,
    actorReady, setActorReady,
    holdState, setHoldState,
    resetDemo
  };

  return (
    <AppContext.Provider value={ctx}>
      {page === 'landing' && <LandingPage onEnter={enterApp} />}
      {page !== 'landing' && (
        <Layout>
          {page === 'onboarding' && <Onboarding />}
          {page === 'myset' && <MySet />}
          {page === 'adcommand' && <ADCommand />}
          {page === 'livetake' && <LiveTake />}
          {page === 'lighting' && <LightingConsole />}
          {page === 'wardrobe' && <WardrobeTalent />}
          {page === 'intelligence' && <TakeIntelligence />}
        </Layout>
      )}
    </AppContext.Provider>
  );
}

export default App;
