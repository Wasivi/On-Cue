import { useState } from 'react';
import { createContext, useContext } from 'react';
import type { Role, Take, TakeResult, RetakeCause, AgentEvent } from './types';
import { production as seedProduction } from './data/seed';
import Layout from './components/Layout';
import MySet from './pages/MySet';
import ADCommand from './pages/ADCommand';
import LiveTake from './pages/LiveTake';
import LightingConsole from './pages/LightingConsole';
import WardrobeTalent from './pages/WardrobeTalent';
import TakeIntelligence from './pages/TakeIntelligence';
import AgentActivity from './pages/AgentActivity';
import Onboarding from './pages/Onboarding';

export type Page = 'myset' | 'adcommand' | 'livetake' | 'lighting' | 'wardrobe' | 'intelligence' | 'activity' | 'onboarding';
export type HoldState = 'hold' | 'ready' | 'rolling';

interface AppContextType {
  role: Role;
  setRole: (r: Role) => void;
  page: Page;
  setPage: (p: Page) => void;
  lightingReady: boolean;
  actorReady: boolean;
  holdState: HoldState;
  holdStartedAt: number;
  takes: Take[];
  events: AgentEvent[];
  markLightingReady: () => void;
  markActorReady: () => void;
  clearHold: () => void;
  rollCamera: () => void;
  recordTakeOutcome: (result: TakeResult, causes: RetakeCause[], notes: string) => void;
  logAction: (action: string, detail?: string) => void;
  resetDemo: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

let eventSeq = 0;
function makeEvent(role: Role, action: string, detail: string, kind: AgentEvent['kind']): AgentEvent {
  eventSeq += 1;
  return {
    id: `evt-${eventSeq}`,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    role,
    action,
    detail,
    kind
  };
}

const resultLabel: Record<TakeResult, string> = {
  print: 'Print',
  hold: 'Hold',
  noGood: 'No Good',
  incomplete: 'Incomplete'
};

function App() {
  const [role, setRole] = useState<Role>('1st AD');
  const [page, setPage] = useState<Page>('onboarding');
  const [lightingReady, setLightingReady] = useState(false);
  const [actorReady, setActorReady] = useState(false);
  const [holdState, setHoldState] = useState<HoldState>('hold');
  const [holdStartedAt, setHoldStartedAt] = useState<number>(() => Date.now());
  const [takes, setTakes] = useState<Take[]>(seedProduction.currentSetup.takes);
  const [events, setEvents] = useState<AgentEvent[]>([]);

  const pushEvent = (r: Role, action: string, detail: string, kind: AgentEvent['kind']) => {
    setEvents(prev => [...prev, makeEvent(r, action, detail, kind)]);
  };

  const logAction = (action: string, detail = '') => {
    pushEvent(role, action, detail, 'info');
  };

  const markLightingReady = () => {
    setLightingReady(true);
    pushEvent('Gaffer', 'Lighting ready', 'Key light adjusted for actor mark 2, exposure matched', 'ready');
  };

  const markActorReady = () => {
    setActorReady(true);
    pushEvent(
      role === 'Wardrobe' ? 'Wardrobe' : 'Talent Assistant',
      'Actor ready',
      'Continuity confirmed, talent on mark',
      'ready'
    );
  };

  const clearHold = () => {
    setHoldState('ready');
    pushEvent('1st AD', 'Hold cleared', 'All departments confirmed ready — authorized to roll', 'hold');
  };

  const rollCamera = () => {
    setHoldState('rolling');
    pushEvent('1st AD', 'Camera rolling', `Setup ${seedProduction.currentSetup.setupNumber} — Take ${takes.length + 1}`, 'roll');
  };

  const recordTakeOutcome = (result: TakeResult, causes: RetakeCause[], notes: string) => {
    const newTake: Take = {
      number: takes.length + 1,
      result,
      causes,
      notes: notes || (causes.length ? causes.join(', ') : 'No notes'),
      duration: Math.round(20 + Math.random() * 30),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setTakes(prev => [...prev, newTake]);
    pushEvent('Script Supervisor', `Take ${newTake.number} — ${resultLabel[result]}`, newTake.notes, 'take');

    setHoldState('hold');
    setHoldStartedAt(Date.now());

    if (result === 'noGood' || result === 'incomplete') {
      setLightingReady(false);
      setActorReady(false);
      pushEvent('1st AD', 'Reset called', causes.length ? `Departments resetting: ${causes.join(', ')}` : 'Departments resetting', 'hold');
    } else {
      pushEvent('1st AD', 'Holding for next take', 'Departments still marked ready', 'hold');
    }
  };

  const resetDemo = () => {
    setLightingReady(false);
    setActorReady(false);
    setHoldState('hold');
    setHoldStartedAt(Date.now());
    setTakes(seedProduction.currentSetup.takes);
    setEvents([]);
    setPage('myset');
  };

  const ctx: AppContextType = {
    role, setRole, page, setPage,
    lightingReady, actorReady,
    holdState, holdStartedAt,
    takes, events,
    markLightingReady, markActorReady, clearHold, rollCamera, recordTakeOutcome,
    logAction, resetDemo
  };

  return (
    <AppContext.Provider value={ctx}>
      <Layout>
        {page === 'onboarding' && <Onboarding />}
        {page === 'myset' && <MySet />}
        {page === 'adcommand' && <ADCommand />}
        {page === 'livetake' && <LiveTake />}
        {page === 'lighting' && <LightingConsole />}
        {page === 'wardrobe' && <WardrobeTalent />}
        {page === 'intelligence' && <TakeIntelligence />}
        {page === 'activity' && <AgentActivity />}
      </Layout>
    </AppContext.Provider>
  );
}

export default App;
