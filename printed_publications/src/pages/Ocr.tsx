// @ts-ignore
import React, { useRef, useState } from 'react'
import { createWorker } from 'tesseract.js'
import '../Styles/App.css'
import style from '../ui/ocr/ocr.module.scss'
import parseTextByRegex from '../ui/ocr/parser.ts'
import { Book } from '../../types/Book.ts'


export default () => {
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [ocrText, setOcrText] = useState<string>('')

	const [recognizedTextArray, setRecognizedTextArray] = useState<Array<{ [key: string]: string }>>([]);
	const [ImgArray, setImgArray] = useState<string[]>([]);
	const doOCR = async (file: any) => {
		setOcrText('')
		setIsLoading(true)

		const worker = await createWorker('rus+eng', undefined, {
			logger: m => console.log(Math.floor(m.progress * 100)),
		})

		// const { data } = await worker.recognize(file)
		// setOcrText(data.text)
		// setIsLoading(false)
		// parseText = parseTextByRegex(data.text)
		// console.log(parseText)
		// setRecognizedTextArray(prevState => [...prevState, parseText]);

		worker.recognize(file)
			.then(({ data }) => {
				setOcrText(data.text);
				setIsLoading(false);
				const parseText = parseTextByRegex(data.text);
				console.log(parseText);
				setRecognizedTextArray((prevState) => {
					const newState = [...prevState, parseText];
					setImgArray(prevState => [...prevState, URL.createObjectURL(file)]);
					setTotalPage((totalPage) => totalPage + 1);
					return newState;
				});
			})
			.catch((error) => {
				console.error('Ошибка во время распознавания:', error);
				setIsLoading(false);
			});

	}

	const [drag, setDrag] = React.useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [image, setImage] = useState<string>('')

	const dragStartHandler = e => {
		e.preventDefault()
		setDrag(true)
	}

	const dragLeaveHandler = e => {
		e.preventDefault()
		setDrag(false)
		// addPage()
	}

	const onDropHandler = e => {
		e.preventDefault()
		let files = [...e.dataTransfer.files]
		for (let i = 0; i < files.length; i++) {
			doOCR(files[i])
			setImage(URL.createObjectURL(files[i]))
		}
	}

	const handleChange = async (e) => {
		e.preventDefault()
		let files = [...e.target.files]
		if (files) {
			for (let i = 0; i < files.length; i++) {
				await doOCR(files[i])
			}
		}
	}

	const DragDropFile = () => {
		return drag ? (
			<div
				onDragStart={e => dragStartHandler(e)}
				onDragLeave={e => dragLeaveHandler(e)}
				onDragOver={e => dragStartHandler(e)}
				onDrop={e => onDropHandler(e)}
				className={style.dropImg}
			>
				{currentPage >= 1 ? (
					<img
						alt='Загружаемое изображение'
						src={image}
						height='637px'
						width='408px'
					/>
				) : (
					<p>Нажмите стрелку вправо, когда первое изображение будет обработано.
					</p>
				)}
			</div>
		) : (
			<div
				onDragStart={e => dragStartHandler(e)}
				onDragLeave={e => dragLeaveHandler(e)}
				onDragOver={e => dragStartHandler(e)}
				className={style.dropImg}
				onChange={dragStartHandler}
			>
				<div className={style.text}>
					Перетащите сюда файл или&nbsp;
					<label
						htmlFor='filePicker'
						style={{ color: '#550DB2', cursor: 'pointer' }}
					>
						загрузите
					</label>
					<input
						id='filePicker'
						style={{ visibility: 'hidden' }}
						type='file'
						ref={fileInputRef}
						onChange={handleChange}
						accept='.jpg, .jpeg, .png'
						multiple
					></input>
				</div>
			</div>
		)
	}

	const [currentPage, setCurrentPage] = useState(0)
	const [totalPage, setTotalPage] = useState(0)

	const useInputInfo = () => {
		const [BBK, setBBK] = useState('')
		const [YDK, setYDK] = useState('')
		const [Author, setAuthor] = useState('')
		const [PublicationTitle, setPublicationTitle] = useState('')
		const [Year, setYear] = useState('')
		const [ISBN, setISBN] = useState('')
		const [City, setCity] = useState('')
		const [Type, setType] = useState('')
		const [Description, setDescription] = useState('')

		const values = {
			BBK,
			YDK,
			Author,
			PublicationTitle,
			Year,
			ISBN,
			City,
			Type,
			Description,
		}

		return {
			values,
			setBBK,
			setYDK,
			setAuthor,
			setPublicationTitle,
			setYear,
			setISBN,
			setCity,
			setType,
			setDescription,
		}
	}

	const {
		values,
		setBBK,
		setYDK,
		setAuthor,
		setPublicationTitle,
		setYear,
		setISBN,
		setCity,
		setType,
		setDescription,
	} = useInputInfo()

	const unRecognizet = 'Не распознано'

	const handleInfo = (i: number) => {
		setBBK(
			`${recognizedTextArray[i]['ББК']}` != 'undefined'
				? `${recognizedTextArray[i]['ББК']}`
				: unRecognizet
		)
		setYDK(
			`${recognizedTextArray[i]['УДК']}` != 'undefined'
				? `${recognizedTextArray[i]['УДК']}`
				: unRecognizet
		)
		setAuthor(
			`${recognizedTextArray[i]['Автор']}` != 'undefined'
				? `${recognizedTextArray[i]['Автор']}`
				: unRecognizet
		)
		setPublicationTitle(
			`${recognizedTextArray[i]['Название книги']}` !== 'undefined'
				? `${recognizedTextArray[i]['Название книги']}`
				: unRecognizet
		)
		setYear(
			`${recognizedTextArray[i]['Год публикации']}` !== 'undefined'
				? `${recognizedTextArray[i]['Год публикации']}`
				: unRecognizet
		)
		setISBN(
			`${recognizedTextArray[i]['ISBN']}` !== 'undefined'
				? `${recognizedTextArray[i]['ISBN']}`
				: unRecognizet
		)
		setCity(
			`${recognizedTextArray[i]['Город издания']}` !== 'undefined'
				? `${recognizedTextArray[i]['Город издания']}`
				: unRecognizet
		)
		setType(
			`${recognizedTextArray[i]['Тип издания']}` !== 'undefined'
				? `${recognizedTextArray[i]['Тип издания']}`
				: unRecognizet
		)
	}

	const xaos = (e, name) => {
		const input = e.target.value
		if (name == 'BBK') setBBK(input)
		if (name == 'YDK') setYDK(input)
		if (name == 'author') setAuthor(input)
		if (name == 'title_publication') setPublicationTitle(input)
		if (name == 'year_publication') setYear(input)
		if (name == 'city_publication') setCity(input)
		if (name == 'ISBN') setISBN(input)
		if (name == 'type_publication') setType(input)
		if (name == 'description') setDescription(input)
	}

	const goToPreviousPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage => {
				const newPage = currentPage - 1;
				updateInputFields(newPage)
				return newPage
			})
		}
	}

	const addPage = () => {
		setTotalPage(totalPage => totalPage + 1)
	}

	const goToNextPage = () => {
		if (currentPage < totalPage) {
			setCurrentPage(currentPage => {
				const newPage = currentPage + 1
				updateInputFields(newPage)
				return newPage
			})
		}
	}
	const updateInputFields = (page: number) => {
		handleInfo(page - 1)
		setImage(ImgArray[page - 1])
	}

	const inputInfo = [
		{
			title: 'ББК',
			name: 'BBK',
			value: values.BBK,
		},
		{
			title: 'УДК',
			name: 'YDK',
			value: values.YDK,
		},
		{
			title: 'Автор',
			name: 'author',
			value: values.Author,
		},
		{
			title: 'Название книги',
			name: 'title_publication',
			value: values.PublicationTitle,
		},
		{
			title: 'Год публикации',
			name: 'year_publication',
			value: values.Year,
		},
		{
			title: 'ISBN',
			name: 'ISBN',
			value: values.ISBN,
		},
		{
			title: 'Город издания',
			name: 'city_publication',
			value: values.City,
		},
		{
			title: 'Тип издания',
			name: 'type_publication',
			value: values.Type,
		},
		{
			title: 'Описание',
			name: 'description',
			value: values.Description,
		},
	]

	const saveBook = () => {
		const userString = localStorage.getItem('user');
		const user = userString ? JSON.parse(userString) : null;
		
		const yearString = recognizedTextArray[currentPage-1]['Год публикации'];
		let yearNumber = yearString !== null ? parseInt(yearString, 10) : 0;
		if (isNaN(yearNumber)){
			yearNumber = 0;
		}
		console.log(yearNumber);
		const dbBook: Book = {
			id_user: user.id,
			author: recognizedTextArray[currentPage-1]['Автор'],
			title: recognizedTextArray[currentPage-1]['Название книги'],
			date: yearNumber, 
			city: recognizedTextArray[currentPage-1]['Город издания'],
			description: "",
			quantity: 1,
			lbc: recognizedTextArray[currentPage-1]['ББК'],
			udc: recognizedTextArray[currentPage-1]['УДК'],
			ISBN: recognizedTextArray[currentPage-1]['ISBN'],
			publication_type: recognizedTextArray[currentPage-1]['Тип издания'],
		};

		const handleAddBook = async () => {
			try {
				//Переделать через env
				const response = await fetch('http://localhost:5000/addBook', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(dbBook),
				});
			} catch (error) {
				console.error('Ошибка:', error);
			}
		};
		handleAddBook();
	}

	return (
		<>
			<div className={style.container}>
				<h1 style={{ marginBottom: '52px' }}>Добавление печатных изданий</h1>
				<div className={style.elements}>
					<div className={style.containerOcr}>{DragDropFile()}</div>
					<div className={style.propertiesList}>
						{/* {inputInfo.map(info => (
							<>
								<div key={currentPage} className={style.inputFieldName}>
									{info.title}
								</div>
								<input
									className={style.inputField}
									name={info.name}
									value={info.value}
									onChange={e => xaos(e, info.name)}
								/>
							</>
						))} */}
						{inputInfo.map(info => (
							<>
								<div key={currentPage} className={style.inputFieldName}>
									{info.title}
								</div>
								<input
									className={style.inputField}
									name={info.name}
									value={info.value}
									onChange={e => xaos(e, info.name)}
									type={info.name === 'year_publication' ? 'number' : 'text'} 
								/>
							</>
						))}
					</div>
				</div>
			</div>
			<div className={style.bottom}>
				<div className={style.bottomElement1}>
					<button
						className={style.arrowl}
						style={{ marginLeft: '807px ' }}
						onClick={goToPreviousPage}
					>
						<img src='ArrowLeft.svg' alt='Левая стрелка' />
					</button>
					<div className={style.counter}>
						{currentPage} из {totalPage}
					</div>
					<button
						className={style.arrowl}
						style={{ marginRight: '600px' }}
						onClick={goToNextPage}
					>
						<img src='ArrowRight.svg' alt='Правая стрелка' />
					</button>
				</div>
				<div className={style.bottomElement2}>
					{/* <button className={style.addMore} onClick={e => dragLeaveHandler(e)}>
						Добавить еще
					</button> */}
					<button className={style.save} onClick={saveBook}>Сохранить</button>
				</div>
			</div>
		</>
	)
}
