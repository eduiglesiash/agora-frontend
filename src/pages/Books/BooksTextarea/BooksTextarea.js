import './BooksTextarea.css';

export default function Textarea({ id, classes, value, name, type, layer, placeholder, onChange, error }) {
  const classnames = `Books__textarea ${classes || ''} ${error !== undefined && error !== '' ? 'Books__textarea--error' : ''}`;
    return (
      <div className='Books__textarea-container'>
      <span className={error !== undefined && error !== '' ? 'Books__textarea-layer Books__textarea-layer--error' : 'Books__textarea-layer'}>{layer}</span>
        <textarea
          id={id}
          className={classnames}
          defaultValue={value}
          name={name}
          type={type}
          placeholder={placeholder}
          onChange={onChange}
        />
        { error !== undefined && error !== '' && (
          <span className='Books__textarea-error'>{error}</span>
        )}
      </div>
    )
}
