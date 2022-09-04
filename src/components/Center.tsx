export default function CenterComponent ({ children, className = "" }: { children: React.ReactNode[] | React.ReactNode, className?: string}) {
    return <div className={`flex-1 flex justify-center items-center ${className}`}>
        {children}
    </div>
}