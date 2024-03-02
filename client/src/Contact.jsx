import React from 'react'
import Avatar from './Avatar'

const Contact = ({id,username,onClick,selected,online}) => {
  return (
    <div
    key={id}
    onClick={() => onClick(id)}
    className={
      "border-b border-gray-100  flex items-center gap-2 cursor-pointer" +
      (selected ? "bg-blue-50" : "")
    }
  >
    {selected && (
      <div className="w-1 bg-blue-500 h-12"></div>
    )}
    <div className="flex pl-2 gap-2 py-2 pt-3 items-center ">
      <Avatar
        online={online}
        username={username}
        userId={id}
      />
      <span className="text-gray-800">{username}</span>
    </div>
  </div>
  )
}

export default Contact
