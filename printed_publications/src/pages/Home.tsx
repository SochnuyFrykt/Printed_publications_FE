import { Button, Tag } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import style from '../ui/home/home.module.scss'
import { Book } from '../../types/Book.ts'
import React, { useContext, useEffect, useRef, useState } from 'react';
import type { InputRef } from 'antd';
import { Form, Input, Popconfirm, Table, Select } from 'antd';
import type { FormInstance } from 'antd/es/form';
import ConfirmationModal from "../ui-kit/confirmation/confirmation.tsx";
import generateAndDownloadCSV from "../functions/exportList.tsx";

export default () => {
  const EditableContext = React.createContext<FormInstance<any> | null>(null);

  let elementDrop = '';

  const onChangeDrop = (value: string) => {
    console.log(`selected ${value}`);
    elementDrop = value;
  };

  const onSearchDrop = (value: string) => {
    console.log('search:', value);
  };

  const filterOptionDrop = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  interface EditableRowProps {
    index: number;
  }

  const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };

  interface EditableCellProps {
    title: React.ReactNode;
    editable: boolean;
    children: React.ReactNode;
    dataIndex: keyof Book;
    record: Book;
    handleSave: (record: Book) => void;
  }

  const EditableCell: React.FC<EditableCellProps> = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef<InputRef>(null);
    const form = useContext(EditableContext)!;

    useEffect(() => {
      if (editing) {
        inputRef.current!.focus();
      }
    }, [editing]);

    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    };

    const save = async () => {
      try {
        const values = await form.validateFields();

        toggleEdit();
        handleSave({ ...record, ...values });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };

    let childNode = children;

    // const columnRules = {
    //   author: { required: true },
    // };

    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{ margin: 0 }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `"${title}" является обязательным полем.`,
            },

          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} style={{ width: `auto` }} />
        </Form.Item>
      ) : (
        <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
          {children}
        </div>
      );
    }

    return <td {...restProps}>{childNode}</td>;
  };

  type EditableTableProps = Parameters<typeof Table>[0];

  type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

  const CustomTable: React.FC = (query?) => {
    const [authors, setAuthors] = useState<String[]>([]);

    const optionsDrop = authors.map(author => ({
      value: author.toString(),
      label: author.toString(),
    }));

    optionsDrop.unshift({
      value: 'Все авторы',
      label: 'Все авторы',
    });
    const [bookData, setBookData] = useState<Book[]>([]);
    const handleLoadBooks = async () => {
      const userString = localStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      try {
        const response = await fetch('http://localhost:5000/loadList', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
          }),
        });
        const booksFromServer = await response.json();
        const booksWithKeys = booksFromServer.map((book, index) => ({
          ...book,
          key: String(index + 1),
        }));
        return booksWithKeys;
      } catch (error) {
        console.error('Ошибка:', error);
      }
    };

    useEffect(() => {
      const fetchData = async () => {
        try {
          const newData = await handleLoadBooks();
          setBookData(newData);
        } catch (error) {
          console.error("Произошла ошибка при загрузке книг", error);
        }
      };

      fetchData();
    }, []);
    const handleBookDataChange = () => {
      const uniqueAuthors = Array.from(new Set(bookData.map(book => book.author)));
      setAuthors(uniqueAuthors);
    };

    const handleDelete = (key: React.Key) => {
      const indexBD = parseInt(String(key), 10);
      const handleDeleteBD = async () => {
        try {
          const response = await fetch('http://localhost:5000/deleteBook', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookData[indexBD - 1]),
          });
        } catch (error) {
          console.error('Ошибка:', error);
        }
      };
      handleDeleteBD();

      const newData = bookData.filter((item) => item.key !== key)
      setBookData(newData);
    };

    const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
      {
        title: 'Автор',
        dataIndex: 'author',
        editable: true,
      },
      {
        title: 'Название издания',
        dataIndex: 'title',
        editable: true,
      },
      {
        title: 'Дата публикации',
        dataIndex: 'date',
        editable: true,
      },
      {
        title: 'Город',
        dataIndex: 'city',
        editable: true,
      },
      {
        title: 'Количество',
        dataIndex: 'quantity',
        editable: true,
      },
      {
        title: 'ББК',
        dataIndex: 'lbc',
        editable: true,
      },
      {
        title: 'УДК',
        dataIndex: 'udc',
        editable: true,
      },
      {
        title: 'ISBN',
        dataIndex: 'ISBN',
        editable: true,
      },
      {
        title: 'Тип публикации',
        dataIndex: 'publication_type',
        editable: true,
      },
      {
        title: 'Описание',
        dataIndex: 'description',
        editable: true,
      },
      {
        title: 'Операция',
        dataIndex: 'operation',
        render: (_, record: { key: React.Key }) =>
          bookData.length >= 1 ? (
            <Popconfirm title="Удалить?"
              okText="Да"
              cancelText="Отмена"
              onConfirm={() => handleDelete(record.key)}>
              <a style={{ color: '#F44B4B' }}>Удалить</a>
            </Popconfirm>
          ) : null,
      },
    ];

    const handleSave = (row: Book) => {
      const newData = [...bookData];
      const index = newData.findIndex((item) => row.key === item.key);
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        ...row,
      });
      const handleEditBook = async () => {
        try {
          const response = await fetch('http://localhost:5000/editBook', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newData[index]),
          });
        } catch (error) {
          console.error('Ошибка:', error);
        }
      };
      handleEditBook();
      setBookData(newData);
    };

    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };

    const columns = defaultColumns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record: Book) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave,
        }),
      };
    });

    const useFiltersAndSearch = (e) => {
      e.preventDefault();
      const fetchData = async () => {
        try {
          const newData = await handleLoadBooks();
          applyFilters(e, newData);
        } catch (error) {
          console.error("Произошла ошибка при загрузке книг", error);
        }
      };
      fetchData();

    }

    const applyFilters = (e, newData: Book[]) => {
      e.preventDefault();
      let query;
      const formData = new FormData(e.target);
      query = formData.get('inputSearch');
      query = query?.toLowerCase();

      if (query !== '') {
        newData = newData.filter((book) => {
          for (const key in book) {
            if (book.hasOwnProperty(key) && typeof book[key] === 'string') {
              if (book[key].toLowerCase().includes(query)) {
                return true;
              }
            }
          }
        });
      } else {
        console.log('Поиск не использовался')
      }

      const date1Entry = formData.get('date1');
      let date1AsNumber;
      if (date1Entry !== null && typeof date1Entry === 'string' && date1Entry !== '') {
        date1AsNumber = parseInt(date1Entry, 10);
        newData = newData.filter((book) => {
          for (const key in book) {
            if (key === 'date') {
              if (book[key] >= date1AsNumber) {
                return true;
              }
            }
          }
        })
      } else {
        console.log('Первое число не использовалось')
      }


      const date2Entry = formData.get('date2');
      let date2AsNumber;
      if (date2Entry !== null && typeof date2Entry === 'string' && date2Entry !== '') {
        date2AsNumber = parseInt(date2Entry, 10);
        newData = newData.filter((book) => {
          for (const key in book) {
            if (key === 'date') {
              if (book[key] <= date2AsNumber) {
                return true;
              }
            }
          }
        })
      } else {
        console.log('Второе число не использовалось')
      }

      if (elementDrop !== 'Все авторы' && elementDrop !== '') {
        newData = newData.filter((book) => {
          for (const key in book) {
            if (key === 'author') {
              if (book[key] === elementDrop) {
                return true;
              }
            }
          }
        })
      } else {
        console.log('Автор не использовался')
      }
      setBookData(newData);

    }

    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const [isModalVisible, setModalVisible] = useState(false);
    const handleConfirm = async () => {
      console.log('Действие подтверждено');
      setModalVisible(false);
      try {
        const response = await fetch('http://localhost:5000/deleteAllBooks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: user.id,
          }),
        });
      } catch (error) {
        console.error('Ошибка:', error);
      }
    };
    const handleCancel = () => {
      console.log('Действие отменено');
      setModalVisible(false);
    };



    return (
      <div>
        <form onSubmit={useFiltersAndSearch}>
          <div className={style.frameWithoutColor}>
            <div className={style.bigName}>Список печатный изданий</div>
            <div className={style.filters}>
              <div className={style.date}>
                <input name='date1' type="text" className={style.date1} placeholder='Дата начала' />
                <div className={style.imageWrapper2}>
                  <img src="CalendarCheck.svg" alt="MagnifyingGlass" />
                </div>
              </div>
              <div className={style.date}>
                <input name='date2' type="text" className={style.date1} placeholder='Дата конца' />
                <div className={style.imageWrapper2}>
                  <img src="CalendarCheck.svg" alt="MagnifyingGlass" />
                </div>
              </div>
              <div className={style.dropDownList}>
                <Select
                  showSearch
                  placeholder="Выберите автора"
                  optionFilterProp="children"
                  onClick={handleBookDataChange}
                  onChange={onChangeDrop}
                  onSearch={onSearchDrop}
                  filterOption={filterOptionDrop}
                  style={{ width: "442px", height: "52px", textAlign: 'left' }}
                  options={optionsDrop}
                  defaultValue={optionsDrop.length > 0 ? optionsDrop[0].value : undefined}
                />
              </div>
            </div>
          </div>

          <div className={style.frc}>
            <div className={style.listActions}>
              <div className={style.Text1}>Действия со списком</div>
              <Tag color='#FEE' icon={<DeleteOutlined />} className={style.deleteButton} onClick={() => setModalVisible(true)}>Удалить всё</Tag>
              <ConfirmationModal
                visible={isModalVisible}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
              />
              <Tag color='#F0EDF5' icon={<DownloadOutlined />} className={style.exportButton} onClick={() => generateAndDownloadCSV(bookData)}>Экспорт</Tag>
            </div>
            <div className={style.search}>
              <input name='inputSearch' type="inputSearch" className={style.search1} />
              <button className={style.imageWrapper}>
                <img src="MagnifyingGlass.svg" alt="MagnifyingGlass" />
              </button>
            </div>
          </div>
        </form>

        <div className='frame-without-color-2'>
          <Table
            components={components}
            rowClassName={() => 'editable-row'}
            bordered
            dataSource={bookData}
            columns={columns as ColumnTypes}
          />
        </div>
      </div>
    );

  };

  return (
    <>
      <CustomTable />
    </>
  )

}