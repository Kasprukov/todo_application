import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { USER_ID, createTodo } from '../api/todos';
import { Todo } from '../types/Todo';

type Props = {
  onAdd: (todo: Todo) => void;
  isAllTodosCompleted: boolean;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  fieldTitle: React.RefObject<HTMLInputElement>;
  isTodo: boolean;
  onChangeTodoStatus: () => void;
};

export const Header: React.FC<Props> = ({
  onAdd,
  isAllTodosCompleted,
  setErrorMessage,
  setTempTodo,
  fieldTitle,
  isTodo,
  onChangeTodoStatus,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fieldTitle.current?.focus();
  }, [isSubmitting, fieldTitle]);

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const title = newTitle.trim();

    if (!title) {
      setErrorMessage('Title should not be empty');
    } else {
      setIsSubmitting(true);
      const todo = {
        title,
        userId: USER_ID,
        completed: false,
        id: 0,
      };

      setTempTodo(todo);
      createTodo(title)
        .then(newTodo => {
          onAdd(newTodo);
          setNewTitle('');
        })
        .catch(() => {
          setErrorMessage('Unable to add a todo');
        })
        .finally(() => {
          setIsSubmitting(false);
          setTempTodo(null);
        });
    }
  };

  return (
    <header className="todoapp__header">
      {isTodo && (
        <button
          onClick={() => onChangeTodoStatus()}
          type="button"
          className={cn('todoapp__toggle-all', { active: isAllTodosCompleted })}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleOnSubmit}>
        <input
          ref={fieldTitle}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
