export default function MixModal({
    params: {id: postId},
  }:{
    params: {id: string};
  }) {
    return <div className="top-0 left-0 absolute text-xl text-zinc-700 p-16">{postId}</div>;
  }