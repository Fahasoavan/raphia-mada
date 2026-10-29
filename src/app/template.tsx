// Re-mount à chaque navigation : donne une transition d'entrée à chaque page.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-in">{children}</div>;
}
