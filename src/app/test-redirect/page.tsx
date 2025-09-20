"use client"

export default function TestRedirectPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">测试跳转页面</h1>
        <p>如果你看到这个页面，说明跳转功能正常工作</p>
        <button
          onClick={() => window.location.href = '/dashboard'}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          手动跳转到 Dashboard
        </button>
        <button
          onClick={() => {
            console.log('当前路径:', window.location.pathname)
            console.log('localStorage just_logged_in:', localStorage.getItem('just_logged_in'))
          }}
          className="ml-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          调试信息
        </button>
      </div>
    </div>
  )
}