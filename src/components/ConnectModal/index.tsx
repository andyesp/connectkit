import { useEffect, useLayoutEffect, useState, useRef } from 'react';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsName,
  useProvider,
} from 'wagmi';
import { routes, useContext } from './../FamilyKit';

import Modal from '../Modal';

import ConnectButton from './../ConnectButton';

import KnowledgeBase from './KnowledgeBase';
import MetaMask from './MetaMask';
import Connectors from './Connectors';
import WalletConnect from './WalletConnect';

{
  /**
   * TODO:
   *  Discuss best way to manage pages
   */
}
const pages: any = {
  connect: <Connectors />,
  knowledgeBase: <KnowledgeBase />,
  metaMask: <MetaMask />,
  walletConnect: <WalletConnect />,
};

const ConnectModal: React.FC<{ theme?: 'light' | 'dark' | 'auto' }> = ({
  theme = 'light',
}) => {
  const context = useContext();
  const {
    connect,
    connectors,
    error,
    isConnecting,
    pendingConnector,
    reset,
    isConnected,
  } = useConnect();
  const { disconnect } = useDisconnect();

  function resetAll() {
    disconnect();
    reset();
  }

  function show() {
    context.setState({ open: true, route: routes.CONNECT });
  }

  function hide() {
    context.setState({ open: false });
  }

  useEffect(() => {
    function listener(e: KeyboardEvent) {
      if (e.key === 'Escape') hide();
    }
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, []);

  useEffect(() => {
    if (isConnected) hide();
  }, [isConnected]);

  /**
   * Modal transform handling
   */
  const heightRef = useRef<any>(null);
  const listRef = useRef<any>(null);

  const useIsomorphicLayoutEffect =
    typeof window !== 'undefined' ? useLayoutEffect : useEffect;

  const refreshLayout = () => {
    if (!listRef.current || !heightRef.current) return;

    const height = listRef.current.offsetHeight;
    const width = listRef.current.offsetWidth;
    heightRef.current.style.height = `${height - 1}px`;
    heightRef.current.style.width = `${width}px`;
  };

  useIsomorphicLayoutEffect(refreshLayout, [
    context.state.route,
    context.state.open,
  ]);

  return (
    <>
      <ConnectButton onClick={show} theme={theme} />
      {isConnected && <button onClick={resetAll}>Disconnect Wallet</button>}
      <Modal
        theme={theme}
        open={context.state.open}
        children={context.state.route && pages[context.state.route]}
        pageId={context.state.route}
        onClose={hide}
        onBack={
          context.state.route !== routes.CONNECT
            ? () => context.setState({ open: true, route: routes.CONNECT })
            : undefined
        }
      />
    </>
  );
};

export default ConnectModal;
