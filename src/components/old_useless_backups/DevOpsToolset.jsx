const DevOpsToolset = ({ toolsArray }) => {
  return (
    <>
      <h3 className="text-2xl font-bold mb-6 ml-8">
        <code className="text-[#306ee8]">&lt;devops&gt;</code>
      </h3>
      <div className="max-w-6xl mx-auto grid grid-cols-3 gap-8">
        {toolsArray.map((tool) => (
          <div
            className="grid grid-cols-4 flex-grow h-[195px] card-shadow rounded-xl border border-[#183367] relative p-8 text-[#a1a0ab] bg-[#111018]"
            key={tool.id}
          >
            <div className="col-span-3">
              <p className="text-[#8caef2] text-xl font-semibold mb-4">
                <code>
                  &lt;{tool.title}
                  <span className="text-lg"> /</span>&gt;
                </code>
              </p>
              <p className="text-sm font-medium">{tool.description}</p>
            </div>
            {tool.logo}
          </div>
        ))}
      </div>
      <h3 className="text-2xl font-bold mt-6 ml-8">
        <code className="text-[#306ee8]">&lt;/devops&gt;</code>
      </h3>
    </>
  )
}

export default DevOpsToolset
