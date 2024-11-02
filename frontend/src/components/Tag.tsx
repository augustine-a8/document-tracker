interface TagProps {
  title: string;
}

export default function Tag({ title }: TagProps) {
  return (
    <span className={`tag ${title}`}>
      <small className="tag-title">{title}</small>
    </span>
  );
}
