const Background = ({
    children,
  }: {
    children: React.ReactNode;
  }) => {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-tl from-amber-100 to-purple-100 via-neutral-100">
           {children}
        </div>
    );
}

export default Background;