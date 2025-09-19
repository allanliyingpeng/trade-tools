"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProfileService } from "@/lib/supabase/profile"
import { useAuth } from "@/components/providers/auth-provider"
import { Camera, Trash2, Upload } from "lucide-react"

interface AvatarUploadProps {
  avatarUrl?: string | null
  displayName?: string | null
  onAvatarUpdate?: (url: string | null) => void
}

export function AvatarUpload({ avatarUrl, displayName, onAvatarUpdate }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件')
      return
    }

    // 验证文件大小 (最大 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('图片大小不能超过 2MB')
      return
    }

    setIsUploading(true)
    try {
      const { data: url, error } = await ProfileService.uploadAvatar(user.id, file)

      if (error) {
        console.error('Avatar upload error:', error)
        alert('头像上传失败，请重试')
      } else if (url) {
        onAvatarUpdate?.(url)
      }
    } catch (err) {
      console.error('Avatar upload error:', err)
      alert('头像上传失败，请重试')
    } finally {
      setIsUploading(false)
      // 清空文件输入
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveAvatar = async () => {
    if (!user) return

    setIsRemoving(true)
    try {
      const { error } = await ProfileService.removeAvatar(user.id)

      if (error) {
        console.error('Avatar remove error:', error)
        alert('头像删除失败，请重试')
      } else {
        onAvatarUpdate?.(null)
      }
    } catch (err) {
      console.error('Avatar remove error:', err)
      alert('头像删除失败，请重试')
    } finally {
      setIsRemoving(false)
    }
  }

  const getInitials = (name?: string | null) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src={avatarUrl || undefined} alt={displayName || "用户头像"} />
          <AvatarFallback className="text-lg font-semibold">
            {getInitials(displayName)}
          </AvatarFallback>
        </Avatar>

        {/* 相机图标覆盖层 */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 hover:opacity-100 transition-opacity disabled:cursor-not-allowed"
        >
          <Camera className="h-6 w-6 text-white" />
        </button>
      </div>

      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || isRemoving}
        >
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? "上传中..." : "更换头像"}
        </Button>

        {avatarUrl && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRemoveAvatar}
            disabled={isUploading || isRemoving}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isRemoving ? "删除中..." : "删除头像"}
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <p className="text-xs text-muted-foreground text-center max-w-xs">
        支持 JPG、PNG 格式，文件大小不超过 2MB
      </p>
    </div>
  )
}