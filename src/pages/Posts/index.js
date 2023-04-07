import React, { useContext, useState, useEffect, useRef } from "react";
import { ThreeDots } from 'react-loader-spinner';

import styles from "./index.module.css";
import Modal from "../../components/Modal";
import UserContext from "../../contexts/UserContext";
import Header from "../../components/Header";
import api from "../../services/api";
import DeleteIcon from "../../assets/images/delete-icon.svg";
import EditIcon from "../../assets/images/edit-icon.svg";
import Footer from "../../components/Footer";


function Posts() {
    // contexts
    const { user } = useContext(UserContext);

    // refs
    const containerRef = useRef(null);

    // states
    const [newPost, setNewPost] = useState({
        title: "",
        content: ""
    });
    const [isButtonLoading, setIsButtonLoading] = useState({
        create: false,
        delete: false,
        save: false
    });
    const [posts, setPosts] = useState(null);
    const [selectedPost, setSelectedPost] = useState({
        id: null,
        title: "",
        content: ""
    });
    const [pageNumber, setPageNumber] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState({
        delete: false,
        edit: false
    });

    // vars
    const areThereEmptyInputs = {
        newPost: newPost.title.length === 0 || newPost.content.length === 0 ? true : false,
        selectedPost: selectedPost.title.length === 0 || selectedPost.content.length === 0 ? true : false,
    };
    const arePostsLoading = posts ? false : true;
    const isAnyModalOpen = isModalOpen.delete || isModalOpen.edit ? true : false;
    const isUserAuthor = function (author) {
        if (author === user) return true;
        return false;
    }
    const postTime = function (date) {
        const now = new Date().getTime();
        const timeDifference = Math.floor((now - date.getTime()) / (1000 * 60));
        if(timeDifference === 1) return `${timeDifference} minute ago`;
        return `${timeDifference} minutes ago`;
    }

    // handlers
    function handleInputChange(e) {
        if(e.target.getAttribute("id").includes("selected")) setSelectedPost({ ...selectedPost, [e.target.name]: e.target.value });
        else setNewPost({ ...newPost, [e.target.name]: e.target.value });
        
    }

    function handleOpenModal(type, postId) {
        const post = posts.find((post) => post.id === postId);
        setSelectedPost({ id: postId, title: post.title, content: post.content });
        setIsModalOpen({...isModalOpen, [type]: true});
    }

    function handleCloseModal(type) {
        setSelectedPost({ id: null, title: "", content: "" });
        setIsModalOpen({...isModalOpen, [type]: false});
    }

    async function handleDeletePost() {
        setIsButtonLoading({...isButtonLoading, delete: true});

        try {
            await api.deletePost(selectedPost.id);
            setSelectedPost({ ...selectedPost, id: null });
            setIsModalOpen({...isModalOpen, delete: false});
            const { data } = await api.getPosts(10, pageNumber);
            setPosts(data.results);
            setIsButtonLoading({...isButtonLoading, delete: false});
        }
        catch(error) {
            if (error.response.data) console.log(error.response.data);
            else console.log(error);
            setIsButtonLoading({...isButtonLoading, delete: false});
        }
    }

    async function handleEditPost(e) {
        e.preventDefault();
        setIsButtonLoading({...isButtonLoading, save: true});

        try {
            if(selectedPost.id) {
                await api.editPost({ ...selectedPost });
                setSelectedPost({id: null, title: "", content: ""});
                setIsModalOpen({...isModalOpen, edit: false});
                const { data } = await api.getPosts(10, pageNumber);
                setPosts(data.results);
            }
            setIsButtonLoading({...isButtonLoading, save: false});
        }
        catch (error) {
            if (error.response.data) console.log(error.response.data);
            else console.log(error);
            setIsButtonLoading({...isButtonLoading, save: false});
        }
    }

    async function handleCreatePost(e) {
        e.preventDefault();
        setIsButtonLoading({...isButtonLoading, create: true});

        try {
            await api.createPost({ username: user, ...newPost });
            const { data } = await api.getPosts(10, pageNumber);
            setPosts(data.results);
            setIsButtonLoading({...isButtonLoading, create: false});
        }
        catch (error) {
            if (error.response.data) console.log(error.response.data);
            else console.log(error);
            setIsButtonLoading({...isButtonLoading, create: false});
        }
    }

    // inicialization
    useEffect(() => {
        async function loadPage() {
            try {
                const { data } = await api.getPosts(10, pageNumber);
                setPosts(data.results);
            }
            catch (error) {
                if (error.response.data) console.log(error.response.data);
                else console.log(error);
                setIsButtonLoading(false);
            }
        }
        loadPage();
    }, [pageNumber]);

    // render
    return (
        <>
            <Header />
            <main ref={containerRef} className={styles["container"]} disabled={isAnyModalOpen ? true : false}>
                <form id="new-post" className={styles["new-post"]} onSubmit={handleCreatePost}>
                    <h1>What’s on your mind?</h1>
                    <label htmlFor="new-post-title" form="new-post">Title</label>
                    <input id="new-post-title" name="title" type="text" onChange={handleInputChange} value={newPost.title} form="new-post" />
                    <label htmlFor="new-post-content" form="new-post">Content</label>
                    <textarea id="new-post-content" name="content" type="text" onChange={handleInputChange} value={newPost.content} form="new-post" />
                    <div>
                        <button
                            form="new-post"
                            disabled={areThereEmptyInputs.newPost ? true : false}
                        >
                            {isButtonLoading.create ? <ThreeDots color="#FFFFFF" height={10} width={20} /> : "Create"}
                        </button>
                    </div>
                </form>
                <section className={styles["posts"]}>
                    {arePostsLoading ?
                        <ThreeDots color="#7695EC" height={10} width={40} />
                        :
                        posts.map((post) => {
                            const { id, username, created_datetime, title, content } = post;
                            return (
                                <article key={id} className={styles["post"]}>
                                    <div className={styles["post-header"]}>
                                        <h1>{title}</h1>
                                        <div className={styles[!isUserAuthor(username) ? "hidden" : null]}>
                                            <img src={DeleteIcon} onClick={() => handleOpenModal("delete", id)} alt="Delete Icon" />
                                            <img src={EditIcon} onClick={() => handleOpenModal("edit", id)} alt="Edit Icon" />
                                        </div>
                                    </div>
                                    <div className={styles["post-body"]}>
                                        <div>
                                            <h2><span>@{username}</span></h2>
                                            <h2>{postTime(new Date(created_datetime))}</h2>
                                        </div>
                                        <p>{content}</p>
                                    </div>
                                </article>
                            );
                        })
                    }
                </section>
            </main>
            <Footer mainRef={containerRef} pageNumber={pageNumber} setPageNumber={setPageNumber} />
            <Modal
                isOpen={isModalOpen.delete}
                width="35vw"
                height="fit-content"
                borderRadius="0.833333vw"
                padding="15px"
            >
                <div className={styles["delete-modal"]}>
                    <h1>Are you sure you want to delete this item?</h1>
                    <div>
                        <button onClick={() => handleCloseModal("delete")}>Cancel</button>
                        <button onClick={handleDeletePost}>
                            {isButtonLoading.delete ? <ThreeDots color="#FFFFFF" height={10} width={20} /> : "Delete"}
                        </button>
                    </div>
                </div>
            </Modal>
            <Modal
                isOpen={isModalOpen.edit}
                width="35vw"
                height="fit-content"
                borderRadius="0.833333vw"
                padding="15px"
            >
                <form id="edit-modal" className={styles["edit-modal"]} onSubmit={handleEditPost}>
                    <h1>Edit item</h1>
                    <label htmlFor="selected-post-title" form="edit-modal">Title</label>
                    <input id="selected-post-title" name="title" type="text" onChange={handleInputChange} value={selectedPost.title} form="edit-modal" />
                    <label htmlFor="selected-post-content" form="edit-modal">Content</label>
                    <textarea id="selected-post-content" name="content" type="text" onChange={handleInputChange} value={selectedPost.content} form="edit-modal" />
                    <div>
                        <button onClick={() => handleCloseModal("edit")}>Cancel</button>
                        <button
                            form="edit-modal"
                            disabled={areThereEmptyInputs.selectedPost ? true : false}
                        >
                            {isButtonLoading.save ? <ThreeDots color="#FFFFFF" height={10} width={20} /> : "Save"}
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
}

export default Posts;