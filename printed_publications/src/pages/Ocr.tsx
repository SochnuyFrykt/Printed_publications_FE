// @ts-ignore
import React, { useRef, useState } from 'react'
import { createWorker } from 'tesseract.js'
import '../Styles/App.css'
import style from '../ui/ocr/ocr.module.scss'
import parseTextByRegex from '../ui/ocr/parser.ts'

export default () => {
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [ocrText, setOcrText] = useState<string>('')

	const doOCR = async (file: any) => {
		setOcrText('')
		setIsLoading(true)

		const worker = await createWorker('rus', undefined, {
			logger: m => console.log(m.progress * 100),
		})

		const { data } = await worker.recognize(file)
		setOcrText(data.text)
		setIsLoading(false)
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
		addPage()
	}

	const onDropHandler = e => {
		e.preventDefault()
		let files = [...e.dataTransfer.files]
		doOCR(files[0])
	}

	const handleChange = function (e) {
		e.preventDefault()
		if (e.target.files && e.target.files[0]) {
			doOCR(e.target.files[0])
			setImage(URL.createObjectURL(e.target.files[0]))
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
				<img
					alt='Загружаемое изображение'
					src={image}
					height='637px'
					width='408px'
				/>
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
					></input>
				</div>
			</div>
		)
	}

	// fieldValues = [
	// 	'882',
	// 	'84(2Рос-Рус)6-44',
	// 	'Горшков В. С.',
	// 	'АСТ-ПРЕСС',
	// 	'2001',
	// 	'5-7805-0685-Х',
	// 	'Москва',
	// 	'-',
	// 	'',
	// ]

	const [currentPage, setCurrentPage] = useState(1)
	const [totalPage, setTotalPage] = useState(1)
	// const [fieldValues, setFieldValues] = useState(Array(9).fill('-'))
	const [BBK, setBBK] = useState('-')
	const [YDK, setYDK] = useState('-')
	const [Author, setAuthor] = useState('-')
	const [PublicationTitle, setPublicationTitle] = useState('-')
	const [Year, setYear] = useState('-')
	const [ISBN, setISBN] = useState('-')
	const [City, setCity] = useState('-')
	const [Type, setType] = useState('-')
	const [Description, setDescription] = useState('-')

	const myArray = ['371821','293738','392817']

	const xaos = (e:React.ChangeEvent<HTMLInputElement>, name: string) => {
		const input = e.target.value
		if (name === "BBK" ){
			setBBK(input)
		}

	}

	const goToPreviousPage = () => {
		if (currentPage > 1) {
			// setCurrentPage((currentPage) => currentPage - 1)
			// setFieldValues([`${currentPage}`,`${currentPage}`,`${currentPage}`,`${currentPage}`,`${currentPage}`,`${currentPage}`,`${currentPage}`,`${currentPage}`,`${currentPage}`])
			setCurrentPage((currentPage) => {
				const newPage = currentPage - 1;
				// setFieldValues(Array(9).fill(`${newPage}`));
				updateInputFields()
				return newPage;
			  });
		}
	}

	const addPage = () => {
		setTotalPage(totalPage => totalPage + 1)
	}

	const goToNextPage = () => {
		if (currentPage < totalPage) {
			// setCurrentPage((currentPage) => currentPage + 1)
			// setFieldValues([`${currentPage}`,`${currentPage}`,`${currentPage}`,`${currentPage}`,`${currentPage}`,`${currentPage}`,`${currentPage}`,`${currentPage}`,`${currentPage}`])
			setCurrentPage((currentPage) => {
				const newPage = currentPage + 1;
				// setFieldValues(Array(9).fill(`${newPage}`));
				updateInputFields()
				return newPage;
			  });
		}
	}
	const updateInputFields = () => {
		// Logic to fetch data for the current page and update input fields
		// For example, if you have an array of data for each page

		//const currentPageData = getPageData(currentPage); // Implement this function

		// Update input fields using the data for the current page
		// Assuming your input fields are controlled inputs, update their values

		setBBK(myArray[currentPage-1])
	}

	return (
		<>
			<div className={style.container}>
				<h1 style={{ marginBottom: '52px' }}>Добавление печатных изданий</h1>
				<div className={style.elements}>
					<div className={style.containerOcr}>
						{DragDropFile()}
						{parseTextByRegex()}
					</div>
					<div className={style.propertiesList}>
						<div className={style.inputFieldName}>ББК</div>
						<input
							className={style.inputField}
							name='BBK'
							value={BBK}
							onChange={(e) => xaos(e, "BBK")}
						/>
						<div className={style.inputFieldName}>УДК</div>
						<input
							className={style.inputField}
							name='YDK'
							value={BBK}
							onChange={(e) => xaos(e, "BBK")}
						></input>
						<div className={style.inputFieldName}>Автор</div>
						<input
							className={style.inputField}
							name='author'
							value={BBK}
							onChange={(e) => xaos(e, "BBK")}
						></input>
						<div className={style.inputFieldName}>Название издания</div>
						<input
							className={style.inputField}
							name='publicationTitle'
							value={BBK}
							onChange={(e) => xaos(e, "BBK")}
						></input>
						<div className={style.inputFieldName}>Год публикации</div>
						<input
							className={style.inputField}
							name='publicationDate'
							value={BBK}
							onChange={(e) => xaos(e, "BBK")}
						></input>
						<div className={style.inputFieldName}>ISBN</div>
						<input
							className={style.inputField}
							name='ISBN'
							value={BBK}
							onChange={(e) => xaos(e, "BBK")}
						></input>
						<div className={style.inputFieldName}>Город издания</div>
						<input
							className={style.inputField}
							name='year'
							value={BBK}
							onChange={(e) => xaos(e, "BBK")}
						></input>
						<div className={style.inputFieldName}>Тип издания</div>
						<input
							className={style.inputField}
							name='type'
							value={BBK}
							onChange={(e) => xaos(e, "BBK")}
						></input>
						<div className={style.inputFieldName}>Описание</div>
						<input
							className={style.inputField}
							name='description'
							value={BBK}
							onChange={(e) => xaos(e, "BBK")}
						></input>
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
						style={{ marginRight: '394px' }}
						onClick={goToNextPage}
					>
						<img src='ArrowRight.svg' alt='Правая стрелка' />
					</button>
				</div>
				<div className={style.bottomElement2}>
					<button className={style.addMore} onClick={e => dragLeaveHandler(e)}>
						Добавить еще
					</button>
					<button className={style.save}>Сохранить</button>
				</div>
			</div>
		</>
	)
}
