export default function CenterComponent ({ children, style = "" }: { children: React.ReactNode[] | React.ReactNode, style?: string}) {
    return <div className={`flex-1 flex justify-center items-center ${style}`}>
        {children}
    </div>
}