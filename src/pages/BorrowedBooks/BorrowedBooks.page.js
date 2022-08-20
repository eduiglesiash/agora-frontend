import { useState, useEffect } from 'react';
import { findBook } from '../../api/borrowedBooks.api';
import BorrowedBook from '../../components/BorrowedBook/BorrowedBook';

export default function BorrowedBooksPage() {
  const [borrowedBooks, setBorrowedBooks] = useState(undefined);

  useEffect(() => {
		const params = {
			_sort: 'users_library.name:asc',
		};
		findBook({ filter: `?${new URLSearchParams(params).toString()}` })
      .then(res => { console.log(res.data); setBorrowedBooks(res.data) })
      .catch(err => console.error(err));
  }, []);

  return (
		<section className = "a-p-16 a-flex a-flex-column">
			{
				borrowedBooks?.map(borrowedBook =>
					<BorrowedBook
						key={`${borrowedBook.library.imgURL}-${borrowedBook.users_library.id}`}
						imgURL={borrowedBook.library.imgURL}
						title={borrowedBook.library.title}
						date={borrowedBook.created_at}
						userId={borrowedBook.users_library.id}
						userName={borrowedBook.users_library.name}
						userSurname={borrowedBook.users_library.surname}
					/>
				)
			}
		</section>
  )
}
