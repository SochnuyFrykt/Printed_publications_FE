// @ts-ignore
import { Skeleton } from 'antd'
import React, { useRef, useState } from 'react'
import { createWorker } from 'tesseract.js'
import '../Styles/App.css'
import style from '../ui/ocr/ocr.module.scss'

export default () => {
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [ocrText, setOcrText] = useState<string>('')

	const doOCR = async (file: any) => {
		setOcrText('')
		setIsLoading(true)

		const worker = await createWorker('rus')

		console.log(file)
		const { data } = await worker.recognize(file)
		setOcrText(data.text)
		setIsLoading(false)
	}

	const DragDropFile = () => {
		const [drag, setDrag] = React.useState(false)
		const fileInputRef = useRef<HTMLInputElement>(null)

		const dragStartHandler = e => {
			e.preventDefault()
			setDrag(true)
		}

		const dragLeaveHandler = e => {
			e.preventDefault()
			setDrag(false)
		}

		const onDropHandler = e => {
			e.preventDefault()
			let files = [...e.dataTransfer.files]
			console.log(files[0])
			doOCR(files[0])
		}

		const handleClick = () => {
			// 👇️ open file input box on click of another element
			if (fileInputRef.current != null) {
				fileInputRef.current.click()
			}
		}

		return drag ? (
			<div
				onDragStart={e => dragStartHandler(e)}
				onDragLeave={e => dragLeaveHandler(e)}
				onDragOver={e => dragStartHandler(e)}
				onDrop={e => onDropHandler(e)}
				className={style.dropImg}
			>
				Распознание текста
			</div>
		) : (
			<div
				onDragStart={e => dragStartHandler(e)}
				onDragLeave={e => dragLeaveHandler(e)}
				onDragOver={e => dragStartHandler(e)}
				className={style.inputImg}
				onChange={dragStartHandler}
			>
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
					onChange={onDropHandler}
				></input>
			</div>
		)
	}


	const [currentPage, setCurrentPage] = useState(1);
	const totalPages = 52;
	let fieldValues = ['-', '-', '-','-', '-', '-','-', '-', '-'];
	let fieldValuesTEST = ['1', '2', '3','4', '5', '6','8', '9', '10'];
	const goToPreviousPage = () => {
		if (currentPage > 1) {
		  setCurrentPage(currentPage - 1);
		  updateInputFields();
		}
	  };
	  
	  const goToNextPage = () => {
		if (currentPage < totalPages) {
		  setCurrentPage(currentPage + 1);
		  updateInputFields();
		}
	  };
	const updateInputFields = () => {
	// Logic to fetch data for the current page and update input fields
	// For example, if you have an array of data for each page

	// const currentPageData = getPageData(currentPage); // Implement this function
	const currentPageData = fieldValuesTEST[currentPage];

	// Update input fields using the data for the current page
	// Assuming your input fields are controlled inputs, update their values
		// fieldValues[0] = currentPageData.BBK,
		// fieldValues[1] = currentPageData.UDK,
		// fieldValues[2] = currentPageData.author,
		// fieldValues[3] = currentPageData.publicationTitle,
		// fieldValues[4] = currentPageData.publicationDate,
		// fieldValues[5] = currentPageData.ISBN,
		// fieldValues[6] = currentPageData.year,
		// fieldValues[7] = currentPageData.type,
		// fieldValues[8] = currentPageData.description

		fieldValues[0] = currentPageData;
		fieldValues[1] = currentPageData;
		fieldValues[2] = currentPageData;
		fieldValues[3] = currentPageData;
		fieldValues[4] = currentPageData;
		fieldValues[5] = currentPageData;
		fieldValues[6] = currentPageData;
		fieldValues[7] = currentPageData;
		fieldValues[8] = currentPageData;
	};



	return (
		<>
			{/* <div className={style.container}>
				<h1 style={{ marginBottom: '52px' }}>Добавление печатных изданий</h1>
				<div className={style.containerOcr}>
					<div className={style.inputImg}>
						<Upload.Dragger
							height={661}
							style={{ width: '724px', border: '1px dashed #550DB2;' }}
							accept='image/png, image/jpeg'
							name='file'
							multiple={false}
							action={file => {
								doOCR(file)
								return ''
							}}
							customRequest={() => {}}
							fileList={[]}
						>
							<p className='ant-upload-text'>
								Перетащите сюда файлы или загрузите
							</p>
						</Upload.Dragger>
					</div>
					<div>
						{isLoading ? (
							<Skeleton loading />
						) : (
							ocrText && <Card>{ocrText}</Card>
						)}
					</div>
				</div>
			</div> */}

			<div className={style.container}>
				<h1 style={{ marginBottom: '52px' }}>Добавление печатных изданий</h1>
				<div className={style.elements}>
				<div className={style.containerOcr}>
					{DragDropFile()}
					<div className={style.containerElement}>
						{isLoading ? (
							<Skeleton loading />
						) : (
							ocrText && <p style={{ width: '592px' }}>{ocrText}</p>
						)}
					</div>
				</div>
				<div className={style.propertiesList}>
					<div className={style.inputFieldName}>ББК</div>
					<input className={style.inputField} name='BBK' value={fieldValues[0]}/>
					<div className={style.inputFieldName}>УДК</div>
					<input className={style.inputField} name='YDK' value={fieldValues[1]}></input>
					<div className={style.inputFieldName}>Автор</div>
					<input className={style.inputField} name='author' value={fieldValues[2]}></input>
					<div className={style.inputFieldName}>Название издания</div>
					<input className={style.inputField} name='publicationTitle' value={fieldValues[3]}></input>
					<div className={style.inputFieldName}>Год публикации</div>
					<input className={style.inputField} name='publicationDate' value={fieldValues[4]}></input>
					<div className={style.inputFieldName}>ISBN</div>
					<input className={style.inputField} name='ISBN' value={fieldValues[5]}></input>
					<div className={style.inputFieldName}>Город издания</div> 
					<input className={style.inputField} name='year' value={fieldValues[6]}></input> 
					<div className={style.inputFieldName}>Тип издания</div> 
					<input className={style.inputField} name='type' value={fieldValues[7]}></input> 
					<div className={style.inputFieldName}>Описание</div> 
					<input className={style.inputField} name='description' value={fieldValues[8]}></input> 
				</div>
				</div>
			</div>
			<div className={style.bottom}>
				<div className={style.bottomElement1}>
					<button className={style.arrowl} style={{marginLeft : '807px '}}
					onClick={goToPreviousPage}><img src="ArrowLeft.svg" alt="Левая стрелка"/></button>
					<div className={style.counter}>{currentPage} из {totalPages}</div>
					<button className={style.arrowl} style={{marginRight : '426px'}}
					onClick={goToNextPage}><img src="ArrowRight.svg" alt="Правая стрелка"/></button>
				</div>
				<div className={style.bottomElement2}>
					<button className={style.addMore}>Добавить еще</button>
					<button className={style.save}>Сохранить</button>
				</div>				
			</div>


			{/* <div className='container'>
				<h1>Добавление печатных изданий</h1>
				<Row gutter={[50, 50]}>
					<Col span={12}>
						<Upload.Dragger
							height={500}
							style={{ width: '100%' }}
							accept='image/png, image/jpeg'
							name='file'
							multiple={false}
							action={file => {
								doOCR(file)
								return ''
							}}
							customRequest={() => {}}
							fileList={[]}
						>
							<p className='ant-upload-drag-icon'>
								<InboxOutlined />
							</p>
							<p className='ant-upload-text'>
								Нажмите или перетащите файл для загрузки
							</p>
						</Upload.Dragger>
					</Col>
					<Col span={12}>
						{isLoading ? (
							<Skeleton loading />
						) : (
							ocrText && <Card>{ocrText}</Card>
						)}
					</Col>
				</Row>
			</div> */}
		</>
	)
}
