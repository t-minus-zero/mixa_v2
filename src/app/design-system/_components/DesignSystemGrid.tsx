

const DesignSystemGrid = ( {children} : {children : React.ReactNode} ) => {
    return (
        <div
        style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr", gridTemplateRows: "1fr", maxWidth: "1440px" }} 
        className="w-full grid gap-12">
            {children}
      </div>
    );
  }

export default DesignSystemGrid;