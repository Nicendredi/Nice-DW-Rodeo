import './App.css';
import { CharacterStoreProvider } from './hooks/useCharacterStore.tsx';
import { CharacterSheet } from './pages/Character/CharacterSheet.tsx';

function App() {
  return (
    <CharacterStoreProvider>
      <main>
        <CharacterSheet />
      </main>
    </CharacterStoreProvider>
  );
}

export default App;
