// 临时调试文件 - 验证环境变量和登录
console.log('Environment Variables Check:')
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '已设置' : '未设置')

// 如果在浏览器中运行，检查客户端环境变量
if (typeof window !== 'undefined') {
  console.log('客户端环境变量检查:')
  console.log('window.location:', window.location.href)
  console.log('localStorage just_logged_in:', localStorage.getItem('just_logged_in'))
}