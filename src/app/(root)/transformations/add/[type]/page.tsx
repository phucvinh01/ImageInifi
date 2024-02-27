import Header from '@/components/shared/Header';
import TransformationForm from '@/components/shared/TransformationForm';
import { transformationTypes } from '@/constants';
import { getUserById } from '@/lib/actions/user.actions';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React, { useState } from 'react';

const AddTransformationsTypePage = async ({
  params: { type },
}: SearchParamProps) => {
  const { userId } = auth();

  if (!userId) redirect('/sign-in');

  const user = await getUserById(userId);

  const transformation = transformationTypes[type];
  console.log(transformation);

  return (
    <div>
      <Header
        title={transformation.title}
        subtitle={transformation.subTitle}
      />
      <section className='mt-10'>
        <TransformationForm
          action='Add'
          type={transformation.type as TransformationTypeKey}
          userId={user._id}
          creditBalance={user?.creditBalance}
        />
      </section>
    </div>
  );
};

export default AddTransformationsTypePage;
