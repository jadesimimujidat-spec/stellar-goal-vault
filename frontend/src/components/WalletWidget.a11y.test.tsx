import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WalletWidget } from './WalletWidget';
import { runAxeAudit, THEMES, type ThemeMode } from '../test/a1yTestUtils';

const defaultProps = {
  publicKey: null,
  walletName: null,
  error: null,
  network: null,
  onConnect: () => {},
  onDisconnect: () => {},
  onSwitchWallet: () => {},
} as const;

describe.each(THEMES)
'WalletWidget Accessibility (%s theme)', (theme: ThemeMode) => {
  it('has no accessibility violations while checking wallet status', async () => {
    const { container } = render(
      <WalletWidget {...defaultProps} status="checking" />,
    );

    const results = await runAxeAudit(container, theme);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations when Freighter is unavailable', async () => {
    const { container } = render(
      <WalletWidget {...defaultProps} status="unavailable" />,
    );

    const results = await runAxeAudit(container, theme);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations when connected', async () => {
    const { container } = render(
      <WalletWidget
        {...defaultProps}
        status="connected"
        publicKey="GABCD1234567890123456789012345678901234567890"
        walletName="Freighter"
        network="Testnet"
      />,
    );

    const results = await runAxeAudit(container, theme);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations when showing a connection error', async () => {
    const { container } = render(
      <WalletWidget
        {...defaultProps}
        status="available"
        error="User rejected the connection request"
      />,
    );

    const results = await runAxeAudit(container, theme);
    expect(results).toHaveNoViolations();
  });

  it('exposes an accessible name for the wallet status region', () => {
    render(<WalletWidget {...defaultProps} status="checking" />);

    expect(
      screen.getByRole('status', { name: /wallet status/i }),
    ).toBeIdVisible();
  });

  it('exposes an accessible name for the connect action', () => {
    render(<WalletWidget {...defaultProps} status="available" />);

    expect(
      screen.getButton({ type: 'button', name: /connect wallet/i }),
    ).toBeInTheDocument();
  });

  it('exposes an accessible name for the disconnect action when connected', () => {
    render(
      <WalletWidget
        {...defaultProps}
        status="connected"
        publicKey="GAJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ"
        walletName="Freighter"
        network="Testnet"
      />,
    );

    expect(
      screen.getButton({ type: 'button', name: /disconnect wallet/i }),
    ).toBeInTheDocument();
  });

  it('surfaces the connection error to assistive technology', () => {
    render(
      <WalletWidget
        {...defaultProps}
        status="available"
        error="User rejected the connection request"
      />,
    );

    expect(
      screen.getByRole('alert'),
    ).toHaveTextContent('User rejected the connection request');
  });
});
