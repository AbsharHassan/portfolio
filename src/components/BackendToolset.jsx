const BackendToolset = ({ toolsArray }) => {
  return (
    <>
      <h3 className="text-2xl font-bold mb-6 ml-8">
        <code className="text-[#306ee8]">&lt;backend&gt;</code>
      </h3>
      <div className="max-w-6xl mx-auto grid grid-cols-6 gap-8 ">
        {toolsArray.map((tool, index) => (
          <div
            className={`col-span-2 grid grid-cols-4 flex-grow h-[195px] card-shadow rounded-xl border border-[#183367] relative p-8 text-[#a1a0ab] bg-[#111018] ${
              index === 3 && 'col-start-2'
            } ${index === 4 && 'col-start-4'}`}
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
        <code className="text-[#306ee8]">&lt;/backend&gt;</code>
      </h3>
    </>
  )
}

export default BackendToolset
