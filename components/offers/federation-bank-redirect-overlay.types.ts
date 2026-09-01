export type FederationBankRedirectOverlayState = 'idle' | 'loading' | 'error';

export interface FederationBankRedirectOverlayProps {
  readonly state: FederationBankRedirectOverlayState;
  readonly errorMessage: string | null;
  readonly onDismiss: () => void;
}
