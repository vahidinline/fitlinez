import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import CategoryList from '../../screens/Home/categoryList';
import api from '../../api/api';

function BlogIndex() {
  const [post, setPost] = useState([]);

  const getPosts = async () => {
    try {
      const data = await api.get('/blog');
      setPost(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <View>
      <CategoryList data={post} view={true} />
    </View>
  );
}

export default BlogIndex;
